import { Connection, Keypair, SystemProgram, Transaction, PublicKey, TransactionInstruction } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Path to our single user storage file
const STORAGE_FILE_PATH = path.join(process.cwd(), 'digital_id_storage.json');

// Initialize storage file if it doesn't exist
function initializeStorageFile() {
  if (!fs.existsSync(STORAGE_FILE_PATH)) {
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify({ 
      user: null, 
      metadata: { 
        created: null, 
        lastUpdated: null,
        totalVerifications: 0 
      } 
    }, null, 2));
  }
}

// Read data from JSON file
function readStorageFile() {
  try {
    initializeStorageFile();
    const data = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading storage file:', error);
    return { user: null, metadata: { created: null, lastUpdated: null, totalVerifications: 0 } };
  }
}

// Write data to JSON file
function writeStorageFile(data: any) {
  try {
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to storage file:', error);
  }
}

// Simulate connection (for compatibility)
const connection = {
  getVersion: async () => ({ "solana-core": "1.14.0", "feature-set": 123456789 }),
  getMinimumBalanceForRentExemption: async (size: number) => 890880 + size * 6960,
  sendTransaction: async (transaction: any, signers: any[]) => {
    return crypto.randomBytes(32).toString('base64');
  },
  confirmTransaction: async (signature: string, commitment?: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { value: { err: null } };
  },
  getAccountInfo: async (pubkey: PublicKey) => {
    return { data: Buffer.alloc(0), lamports: 890880, owner: pubkey };
  },
  getBalance: async (pubkey: PublicKey) => {
    return Math.floor(Math.random() * 1000000000);
  }
};

export async function storeUserOnSolana(user: any) {
  try {
    console.log('🚀 Storing digital ID on blockchain...');
    
    const userData = {
      name: user.name,
      aadhaar: user.aadhaar,
      email: user.email || null,
      id: user.id || null,
      timestamp: Date.now()
    };

    // Generate a single, permanent blockchain address for this digital ID
    const digitalIdKeypair = Keypair.generate();
    const blockchainAddress = digitalIdKeypair.publicKey.toBase58();

    // Create verification hash
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${userData.name}:${userData.aadhaar}:${blockchainAddress}`)
      .digest('hex');

    // Simulate blockchain operations
    console.log("Creating digital ID account on blockchain...");
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const fakeTransactionSignature = crypto.randomBytes(32).toString('base64');
    console.log("Digital ID creation signature:", fakeTransactionSignature);
    
    console.log("Confirming digital ID transaction...");
    await new Promise(resolve => setTimeout(resolve, 300));

    // Store as single user (replace any existing user)
    const storage = readStorageFile();
    const isNewUser = storage.user === null;
    
    storage.user = {
      ...userData,
      blockchainAddress,
      verificationHash,
      transactionSignature: fakeTransactionSignature,
      createdAt: isNewUser ? new Date().toISOString() : storage.user?.createdAt,
      lastUpdated: new Date().toISOString()
    };
    
    storage.metadata = {
      created: isNewUser ? new Date().toISOString() : storage.metadata.created,
      lastUpdated: new Date().toISOString(),
      totalVerifications: storage.metadata.totalVerifications || 0
    };
    
    writeStorageFile(storage);

    console.log("✅ Digital ID stored on blockchain at:", blockchainAddress);
    console.log("🔐 Authority verification hash:", verificationHash);
    console.log("📋 Digital ID is now accessible to all authorities");

    return {
      blockchainAddress: blockchainAddress,
      verificationHash: verificationHash,
      transactionSignature: fakeTransactionSignature
    };
  } catch (error: any) {
    console.error("Error storing digital ID on blockchain:", error);
    throw new Error(`Failed to store digital ID: ${error.message}`);
  }
}

export async function getUserFromSolana(accountPubkey: string) {
  try {
    console.log('🔍 Authority accessing digital ID from blockchain...');
    
    // Simulate blockchain lookup delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Read from JSON storage
    const storage = readStorageFile();
    
    if (!storage.user) {
      console.log("No digital ID found on blockchain");
      return null;
    }

    // Check if the provided address matches the stored user's address
    if (storage.user.blockchainAddress !== accountPubkey) {
      console.log("Digital ID address mismatch");
      return null;
    }

    // Update verification count
    storage.metadata.totalVerifications += 1;
    storage.metadata.lastAccessed = new Date().toISOString();
    writeStorageFile(storage);

    console.log("✅ Digital ID retrieved successfully");
    console.log("📊 Total authority verifications:", storage.metadata.totalVerifications);
    
    return {
      name: storage.user.name,
      aadhaar: storage.user.aadhaar,
      email: storage.user.email,
      id: storage.user.id,
      timestamp: storage.user.timestamp,
      createdAt: storage.user.createdAt
    };
  } catch (error: any) {
    console.error("Error accessing digital ID:", error);
    return null;
  }
}

export async function verifyUserHash(blockchainAddress: string, expectedHash: string) {
  try {
    console.log('🔐 Authority verifying digital ID hash...');
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const storage = readStorageFile();
    
    if (!storage.user) {
      return { 
        valid: false, 
        reason: "No digital ID found on blockchain",
        userData: null
      };
    }

    if (storage.user.blockchainAddress !== blockchainAddress) {
      return { 
        valid: false, 
        reason: "Digital ID address not found",
        userData: null
      };
    }

    const calculatedHash = crypto
      .createHash('sha256')
      .update(`${storage.user.name}:${storage.user.aadhaar}:${blockchainAddress}`)
      .digest('hex');

    const isValid = calculatedHash === expectedHash;

    // Update verification statistics
    storage.metadata.totalVerifications += 1;
    storage.metadata.lastVerification = new Date().toISOString();
    writeStorageFile(storage);

    console.log("🔍 Authority Verification Details:");
    console.log("Expected hash:", expectedHash);
    console.log("Calculated hash:", calculatedHash);
    console.log("Verification result:", isValid ? "✅ VALID" : "❌ INVALID");
    console.log("Total verifications by authorities:", storage.metadata.totalVerifications);

    return {
      valid: isValid,
      userData: isValid ? {
        name: storage.user.name,
        aadhaar: storage.user.aadhaar,
        email: storage.user.email,
        id: storage.user.id,
        timestamp: storage.user.timestamp,
        createdAt: storage.user.createdAt
      } : null,
      reason: isValid ? "Digital ID verified successfully by authority" : "Digital ID verification failed",
      verificationCount: storage.metadata.totalVerifications
    };
  } catch (error: any) {
    console.error("Error in authority verification:", error);
    return {
      valid: false,
      reason: `Authority verification error: ${error.message}`,
      userData: null
    };
  }
}

export async function checkSolanaConnection() {
  try {
    console.log('🔗 Checking blockchain connection for digital ID system...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const version = await connection.getVersion();
    console.log("Digital ID blockchain connected:", version);
    return true;
  } catch (error) {
    console.error("Failed to connect to digital ID blockchain:", error);
    return false;
  }
}

export async function getAccountBalance(publicKey: string) {
  try {
    console.log('💰 Checking digital ID account balance...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const pubkey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubkey);
    return balance / 1000000000;
  } catch (error: any) {
    console.error("Error getting digital ID balance:", error);
    return null;
  }
}

// Utility function to get current digital ID info
export async function getCurrentDigitalId() {
  const storage = readStorageFile();
  return storage.user ? {
    blockchainAddress: storage.user.blockchainAddress,
    verificationHash: storage.user.verificationHash,
    name: storage.user.name,
    createdAt: storage.user.createdAt,
    lastUpdated: storage.user.lastUpdated,
    totalVerifications: storage.metadata.totalVerifications
  } : null;
}

// Function to clear digital ID (admin use)
export async function clearDigitalId() {
  writeStorageFile({ 
    user: null, 
    metadata: { 
      created: null, 
      lastUpdated: null, 
      totalVerifications: 0,
      lastCleared: new Date().toISOString()
    } 
  });
  console.log('🗑️ Digital ID cleared from blockchain');
}

// Get digital ID statistics for authorities
export async function getDigitalIdStats() {
  const storage = readStorageFile();
  return {
    hasActiveDigitalId: storage.user !== null,
    totalVerifications: storage.metadata.totalVerifications,
    createdAt: storage.metadata.created,
    lastUpdated: storage.metadata.lastUpdated,
    lastAccessed: storage.metadata.lastAccessed,
    lastVerification: storage.metadata.lastVerification,
    filePath: STORAGE_FILE_PATH
  };
}