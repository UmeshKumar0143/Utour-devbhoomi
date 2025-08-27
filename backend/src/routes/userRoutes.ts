import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../authmiddleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { storeUserOnSolana, getUserFromSolana, verifyUserHash } from '../blockchain/blockchain.js';

dotenv.config({ path: ".env" });

const router = Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, gender, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);

    res.cookie('auth_token', token);

    res.json({ 
      message: "User registered successfully", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);

    res.cookie('auth_token', token);

    res.json({ 
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: "Logged out successfully" });
});



router.post("/trip/:id", async (req: any, res) => {
  try {
    const { firstName, lastName, dateOfBirth, nationality, aadhaarNumber, gender, profileImage, entryPoint, expectedExitDate, emergencyContacts } = req.body;
    const id  = req.params.id; 

    const digitalId = `DID-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const blockchainResult = await storeUserOnSolana({
      id: id,
      name: firstName + " " + lastName,
      aadhaar: aadhaarNumber as string,
    });

    const tourist = await prisma.tourist.create({
      data: {
        digitalId,
        firstName,
        lastName,
        blockchainHash: blockchainResult?.blockchainAddress || "temp-hash-or-generated-value",
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        aadhaarNumber,
        gender,
        profileImage,
        entryPoint,
        entryDate: new Date(),
        expectedExitDate: expectedExitDate ? new Date(expectedExitDate) : null,
        user: {
          connect: { id: req.user.id }
        },
        emergencyContacts: {
          create: emergencyContacts?.map((contact: any) => ({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            relationship: contact.relationship,
            isPrimary: contact.isPrimary || false,
          })) || [],
        },
      },
      include: { emergencyContacts: true },
    });

    res.json({ 
      message: "Trip planned successfully", 
      tourist,
      authorityVerificationHash: blockchainResult?.verificationHash,
      blockchainAddress: blockchainResult?.blockchainAddress
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/verify-user", async (req, res) => {
  try {
    const { verificationHash, blockchainAddress } = req.body;

    if (!verificationHash || !blockchainAddress) {
      return res.status(400).json({ 
        message: "Both verificationHash and blockchainAddress are required" 
      });
    }

    const verificationResult = await verifyUserHash(blockchainAddress, verificationHash);

    if (verificationResult.valid) {
      res.json({
        success: true,
        message: "User verification successful",
        userData: verificationResult.userData,
        verified: true
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User verification failed",
        reason: verificationResult.reason,
        verified: false
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error during verification",
      error: error.message
    });
  }
});

router.get("/tourist-verification/:touristId", authMiddleware, async (req: any, res) => {
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
        userId: true 
      }
    });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (req.user.id !== tourist.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const blockchainData = await getUserFromSolana(tourist.blockchainHash!);
    
    if (!blockchainData) {
      return res.status(404).json({ message: "Blockchain data not found" });
    }

    const crypto = require('crypto');
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${blockchainData.name}:${blockchainData.aadhaar}:${tourist.blockchainHash}`)
      .digest('hex');

    res.json({
      success: true,
      message: "Tourist verification details retrieved",
      data: {
        touristId,
        digitalId: tourist.digitalId,
        blockchainAddress: tourist.blockchainHash,
        verificationHash: verificationHash,
        instructions: "Provide the verificationHash and blockchainAddress to authorities for identity verification"
      }
    });

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve verification details", 
      error: error.message 
    });
  }
});

router.post('/location', async (req, res) => {
  try {
    const {
      touristId,
      latitude,
      longitude,
      accuracy,
      source = 'GPS',
      speed,
    } = req.body;

    const tourist = await prisma.tourist.update({
      where: { id: touristId },
      data: {
        lastKnownLat: latitude,
        lastKnownLng: longitude,
        lastLocationUpdate: new Date(),
      },
    });

    const locationRecord = await prisma.locationHistory.create({
      data: {
        touristId,
        latitude,
        longitude,
        accuracy,
        source,
        speed,
        timestamp: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: locationRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message,
    });
  }
});

router.post('/panic', async (req, res) => {
  try {
    const { touristId, latitude, longitude, message } = req.body;

    await prisma.tourist.update({
      where: { id: touristId },
      data: {
        status: 'EMERGENCY',
        lastKnownLat: latitude,
        lastKnownLng: longitude,
        lastLocationUpdate: new Date(),
      },
    });

    const incident = await prisma.incident.create({
      data: {
        incidentId: `EMG-${Date.now()}`,
        touristId,
        type: 'PANIC_BUTTON',
        status: 'REPORTED',
        severity: 'CRITICAL',
        title: 'Emergency - Panic Button Activated',
        description: message || 'Tourist activated panic button',
        latitude,
        longitude,
        reportedAt: new Date(),
      },
    });

    await prisma.alert.create({
      data: {
        touristId,
        type: 'EMERGENCY_ALERT',
        severity: 'CRITICAL',
        title: 'Emergency - Panic Button Activated',
        message: 'Tourist has activated panic button and requires immediate assistance',
        latitude,
        longitude,
      },
    });

    const tourist = await prisma.tourist.findUnique({
      where: { id: touristId },
      include: {
        emergencyContacts: true,
        user: true,
      },
    });

    if (tourist?.emergencyContacts) {
      for (const contact of tourist.emergencyContacts) {
        await prisma.notification.create({
          data: {
            type: 'EMERGENCY_ALERT',
            title: 'EMERGENCY ALERT',
            message: `${tourist.firstName} ${tourist.lastName} has activated an emergency alert. Last known location: ${latitude}, ${longitude}`,
            data: {
              touristId,
              incidentId: incident.id,
              emergencyContact: contact.name,
              location: { latitude, longitude },
            },
            touristId,
          },
        });
      }
    }

    res.json({
      success: true,
      message: 'Emergency alert sent successfully',
      data: {
        incidentId: incident.incidentId,
        status: 'EMERGENCY_REPORTED',
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to process emergency alert',
      error: error.message,
    });
  }
});

router.get('/alerts/:touristId', async (req, res) => {
  try {
    const { touristId } = req.params;
    const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;

    const where = {
      touristId,
      ...(unreadOnly === 'true' && { isRead: false }),
    };

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: {
        geoFence: {
          select: {
            name: true,
            riskLevel: true,
            type: true,
          },
        },
      },
    });

    const total = await prisma.alert.count();

    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message,
    });
  }
});

router.patch('/alerts/:alertId/read', async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        isRead: true,
        resolvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Alert marked as read',
      data: alert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update alert',
      error: error.message,
    });
  }
});

router.patch('/safety-score/:touristId', async (req, res) => {
  try {
    const { touristId } = req.params;
    const { score } = req.body;

    const tourist = await prisma.tourist.update({
      where: { id: touristId },
      data: {
        safetyScore: score,
        riskLevel: score >= 80 ? 'SAFE' : score >= 60 ? 'MODERATE' : 'HIGH',
      },
    });

    await prisma.notification.create({
      data: {
        touristId,
        type: 'SAFETY_SCORE_UPDATE',
        title: 'Safety Score Updated',
        message: `Your safety score has been updated to ${score}. Risk level: ${tourist.riskLevel.toLowerCase()}.`,
        data: { safetyScore: score, riskLevel: tourist.riskLevel },
      },
    });

    res.json({
      success: true,
      message: 'Safety score updated successfully',
      data: {
        touristId,
        safetyScore: tourist.safetyScore,
        riskLevel: tourist.riskLevel,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update safety score',
      error: error.message,
    });
  }
});

export default router;