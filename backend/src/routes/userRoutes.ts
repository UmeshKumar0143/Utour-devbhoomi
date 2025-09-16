import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../authmiddleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { storeUserOnSolana,  verifyUserHash, getCurrentDigitalId, getDigitalIdStats } from '../blockchain/blockchain';

dotenv.config({ path: '.env' });

const router = Router();
const prisma = new PrismaClient(); 

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Register route hit with data:', req.body);
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
      res.status(400).json({ message: 'Missing required fields: name, email, password, gender' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, gender, password: hashedPassword },
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment variables');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h', 
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true
    });

    res.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role, 
      },
    });
  } catch (error: any) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/police-register', async (req , res)=>{
    const {email, password, department} = req.body; 

    try{
    const police= await prisma.police.findUnique({
      where:{email},
    })
    
    if(police) {
      res.json({mesasge: "Department already registered"}); 
      return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const new_police = await prisma.police.create({
        data:{
          email: email, 
          department: department, 
          password: hashedPassword, 
        } 
    })

      if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment variables');
    }

    const token = jwt.sign({ id: new_police.id, email: new_police.email }, process.env.JWT_SECRET, {
      expiresIn: '24h', 
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true
    });

    res.json({
      message: 'User registered successfully',
      new_police: {
        id: new_police.id,
        name: new_police.department,
        email: new_police.email,   
    }});

  }catch(error){
    console.log("Error Occured : ", error); 
    return ; 
  }


})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, userType , policeDepartment } = req.body;



    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if(userType=="police"){
      if(!policeDepartment) {
        res.json({message: "Department is required "}); 
        return; 
      }

      const police = await  prisma.police.findUnique({
        where: {email,
          department: policeDepartment, 
          
         },
        
      })

    if(!police) {
        res.json({message:"Incorect Credentials"})
        return; 
      };

    const isPasswordValid = await bcrypt.compare(password, police.password);
       if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;

    }
    
     const token = jwt.sign({ id: police.id, email: police.email }, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });

    res.cookie('token', token, {
      httpOnly: true,
    });

    res.json({
      message: 'Login successful',
      police: {
        id: police.id,
        email: police.email, 
        department: police.department,
      },  
    });
      
  }else {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment variables');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });

    res.cookie('token', token, {
      httpOnly: true,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role, 
      },  
    });
  }
 } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
});

router.use(authMiddleware); 


router.post('/trip/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    console.log('🧳 Creating digital ID for trip:', req.params.id);
    const { firstName, lastName, dateOfBirth, nationality, aadhaarNumber, gender, profileImage, entryPoint, expectedExitDate, emergencyContacts } = req.body;
    const { id } = req.params;

    if (!firstName || !lastName || !dateOfBirth || !nationality || !aadhaarNumber || !gender || !entryPoint) {
      return res.status(400).json({ message: 'Missing required fields' });  // ✅ return here
    }

    const digitalId = `DID-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const currentUser = await prisma.user.findUnique({ where: { id } });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });  // ✅ return here
    }

    console.log('🆔 Creating universal digital ID on blockchain...');
    const blockchainResult = await storeUserOnSolana({
      name: `${firstName} ${lastName}`,
      aadhaar: aadhaarNumber,
      email: currentUser.email,
      id: currentUser.id,
    });

    console.log('🏗️ Creating tourist record...');
    const tourist = await prisma.tourist.create({
      data: {
        digitalId,
        firstName,
        lastName,
        blockchainHash: blockchainResult?.blockchainAddress || 'temp-hash-or-generated-value',
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        aadhaarNumber,
        gender,
        profileImage,
        entryPoint,
        entryDate: new Date(),
        expectedExitDate: expectedExitDate ? new Date(expectedExitDate) : undefined,
        user: { connect: { id } },
        emergencyContacts: emergencyContacts?.length
          ? {
              create: emergencyContacts.map((contact: any) => ({
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
                relationship: contact.relationship,
                isPrimary: contact.isPrimary || false,
              })),
            }
          : undefined,
      },
      include: { emergencyContacts: true },
    });

    return res.json({   // ✅ final return here
      message: 'Digital ID created successfully - Now accessible to all authorities',
      tourist,
      digitalIdInfo: {
        authorityVerificationHash: blockchainResult?.verificationHash,
        blockchainAddress: blockchainResult?.blockchainAddress,
        transactionSignature: blockchainResult?.transactionSignature,
        instructions: 'This digital ID can now be verified by any authority using the verification hash and blockchain address',
      },
    });
  } catch (error: any) {
    console.error('❌ Digital ID creation error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message }); // ✅ return here too
  }
});


router.post('/verify-user', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🏛️ Authority verification request received:', req.body);
    const { verificationHash, blockchainAddress } = req.body;

    if (!verificationHash || !blockchainAddress) {
      res.status(400).json({
        success: false,
        message: 'Both verificationHash and blockchainAddress are required for authority verification',
      });
      return;
    }

    const verificationResult = await verifyUserHash(blockchainAddress, verificationHash);

    if (verificationResult.valid) {
      res.json({
        success: true,
        message: '✅ DIGITAL ID VERIFIED - Authority access granted',
        userData: {
          name: verificationResult.userData?.name,
          aadhaar: verificationResult.userData?.aadhaar,
          email: verificationResult.userData?.email,
          digitalIdCreated: verificationResult.userData?.createdAt,
          lastVerified: new Date().toISOString(),
        },
        verificationDetails: {
          verified: true,
          blockchainConfirmed: true,
          authorityVerificationCount: verificationResult.verificationCount,
          verificationTimestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: '❌ DIGITAL ID VERIFICATION FAILED',
        reason: verificationResult.reason,
        verified: false,
      });
    }
  } catch (error: any) {
    console.error('❌ Authority verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Authority verification system error',
      error: error.message,
    });
  }
});

router.get("/trips/:id",async(req,res)=> {
  const userId = req.params.id; 

  try{


    const user = await prisma.user.findUnique({
      where: {
        id: userId 
      }
    })

    if(!user){
      res.json({message: "User not found "}); 
      return ; 
    }

    const tourist = await prisma.tourist.findUnique({
      where:{
        userId: user.id
      }
    })

    if(!tourist){
      console.log("No Tourist"); 
      res.json({message: "No Tourist Registered "}); 
      return; 
    }

    res.json({message: "Tourist found ", trips:[ tourist]});  

  }catch(e){
    console.log("Error Occured " , e); 
  }

})

router.get('/my-digital-id', async (req: any, res: Response): Promise<void> => {
  try {
    console.log('🆔 Fetching user digital ID...');
    const digitalId = await getCurrentDigitalId();

    if (!digitalId) {
      res.status(404).json({
        success: false,
        message: 'No digital ID found. Create one by planning a trip.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Digital ID retrieved successfully',
      digitalId: {
        blockchainAddress: digitalId.blockchainAddress,
        verificationHash: digitalId.verificationHash,
        name: digitalId.name,
        createdAt: digitalId.createdAt,
        lastUpdated: digitalId.lastUpdated,
        totalAuthorityVerifications: digitalId.totalVerifications,
        instructions: 'Share the blockchain address and verification hash with authorities for identity verification',
      },
    });
  } catch (error: any) {
    console.error('❌ Digital ID fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve digital ID',
      error: error.message,
    });
  }
});

router.get('/authority-dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🏛️ Authority dashboard access...');
    const stats = await getDigitalIdStats();

    res.json({
      success: true,
      message: 'Authority dashboard data',
      systemStatus: {
        digitalIdSystemActive: true,
        hasActiveDigitalId: stats.hasActiveDigitalId,
        totalVerificationsByAuthorities: stats.totalVerifications,
        systemCreated: stats.createdAt,
        lastUpdated: stats.lastUpdated,
        lastAuthorityAccess: stats.lastAccessed,
        lastVerification: stats.lastVerification,
      },
      instructions: {
        verification: "To verify a citizen's digital ID, use POST /verify-user with verificationHash and blockchainAddress",
        access: 'Authorities can access this system anytime without authentication for identity verification',
      },
    });
  } catch (error: any) {
    console.error('❌ Authority dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Authority dashboard error',
      error: error.message,
    });
  }
});

router.get('/tourist-verification/:touristId', async (req: any, res: Response): Promise<void> => {
  try {
    const { touristId } = req.params;

    const tourist = await prisma.tourist.findUnique({
      where: { id: touristId },
      select: {
        blockchainHash: true,
        firstName: true,
        lastName: true,
        aadhaarNumber: true,
        digitalId: true,
        userId: true,
      },
    });

    if (!tourist) {
      res.status(404).json({ message: 'Tourist not found' });
      return;
    }

    if (  touristId !== tourist.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const digitalId = await getCurrentDigitalId();

    if (!digitalId) {
      res.status(404).json({ message: 'Digital ID not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Digital ID verification details for authorities',
      data: {
        touristId,
        digitalId: tourist.digitalId,
        authorityVerificationInfo: {
          blockchainAddress: digitalId.blockchainAddress,
          verificationHash: digitalId.verificationHash,
          name: digitalId.name,
          totalAuthorityVerifications: digitalId.totalVerifications,
        },
        instructions: 'Provide the blockchainAddress and verificationHash to any authority for instant identity verification',
      },
    });
  } catch (error: any) {
    console.error('❌ Tourist verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve verification details',
      error: error.message,
    });
  }
});

router.post('/location', async (req: Request, res: Response) => {
  try {
    console.log('📍 Location route hit');
    res.json({ success: true, message: 'Location endpoint reached' });
  } catch (error: any) {
    console.error('❌ Location error:', error);
    res.status(500).json({ success: false, message: 'Location error', error: error.message });
  }
});

export default router;