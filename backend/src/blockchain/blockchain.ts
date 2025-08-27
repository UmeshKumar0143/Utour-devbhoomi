import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const AUTHORITY_KEY = process.env.AUTHORITY_KEY || "secret-authority-key";

const STORAGE_FILE = path.join(process.cwd(), ".simulated_blockchain.json");
let accountCounter = 1000;

async function initializeStorage() {
  try {
    const data = await fs.readFile(STORAGE_FILE, "utf8");
    return new Map(JSON.parse(data));
  } catch (error) {
    return new Map();
  }
}

const blockchainStorage = await initializeStorage();

async function saveToFile() {
  try {
    await fs.writeFile(STORAGE_FILE, JSON.stringify([...blockchainStorage.entries()]));
  } catch (error) {
    console.error("Error saving to file:", error);
  }
}

export async function storeUserOnSolana(user: { name: string; id: string; aadhaar: string }) {
  try {
    if (!user.name || !user.id || !user.aadhaar) {
      throw new Error("Missing required user data (name, id, or aadhaar)");
    }

    const userData = {
      name: user.name,
      id: user.id,
      aadhaar: user.aadhaar,
      timestamp: Date.now(),
    };

    const simulatedAddress = `SOL${accountCounter.toString().padStart(8, "0")}${crypto
      .randomBytes(16)
      .toString("hex")}`;
    accountCounter++;

    const verificationHash = crypto
      .createHash("sha256")
      .update(`${userData.name}:${userData.id}:${userData.aadhaar}:${simulatedAddress}`)
      .digest("hex");

    const storageData = {
      userData,
      verificationHash,
      createdAt: new Date(),
      txSignature: `SIG${crypto.randomBytes(32).toString("hex")}`,
    };

    blockchainStorage.set(simulatedAddress, storageData);
    await saveToFile();

    console.log("✅ User data stored in simulated Solana at:", simulatedAddress);
    console.log("🔐 Verification hash:", verificationHash);

    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      blockchainAddress: simulatedAddress,
      verificationHash: verificationHash,
      transactionSignature: `SIG${crypto.randomBytes(32).toString("hex")}`,
    };
  } catch (error: any) {
    console.error("Error in simulated blockchain storage:", error);
    throw new Error(`Simulated blockchain error: ${error.message}`);
  }
}

export async function getUserFromSolana(accountPubkey: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const storedData = blockchainStorage.get(accountPubkey);

    if (!storedData) {
      console.log("Account not found in simulated blockchain");
      return null;
    }

    console.log("Retrieved user data from simulated blockchain");
    return storedData.userData;
  } catch (error: any) {
    console.error("Error getting user from simulated blockchain:", error);
    return null;
  }
}

export async function verifyUserHash(blockchainAddress: string, expectedHash: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const storedData = blockchainStorage.get(blockchainAddress);

    if (!storedData) {
      return {
        valid: false,
        reason: "Account not found in simulated blockchain",
        userData: null,
      };
    }

    const userData = storedData.userData;

    const calculatedHash = crypto
      .createHash("sha256")
      .update(`${userData.name}:${userData.id}:${userData.aadhaar}:${blockchainAddress}`)
      .digest("hex");

    const isValid = calculatedHash === expectedHash;

    console.log("🔍 Verification Details:");
    console.log("Expected hash:", expectedHash);
    console.log("Calculated hash:", calculatedHash);
    console.log("Stored hash:", storedData.verificationHash);
    console.log("Match:", isValid);

    return {
      valid: isValid,
      userData: isValid ? userData : null,
      reason: isValid ? "Hash verified successfully in simulation" : "Hash verification failed in simulation",
    };
  } catch (error: any) {
    console.error("Error in simulated verification:", error);
    return {
      valid: false,
      reason: `Simulated verification error: ${error.message}`,
      userData: null,
    };
  }
}

app.post("/api/verify-user", async (req, res) => {
  try {
    const { blockchainAddress, verificationHash, authorityKey } = req.body;

    if (authorityKey !== AUTHORITY_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid authority key" });
    }

    if (!blockchainAddress || !verificationHash) {
      return res.status(400).json({ error: "Missing blockchainAddress or verificationHash" });
    }

    const verificationResult = await verifyUserHash(blockchainAddress, verificationHash);

    if (verificationResult.valid) {
      res.status(200).json({
        success: true,
        userData: verificationResult.userData,
        message: verificationResult.reason,
      });
    } else {
      res.status(400).json({
        success: false,
        message: verificationResult.reason,
        userData: null,
      });
    }
  } catch (error: any) {
    console.error("Error in verification endpoint:", error);
    res.status(500).json({ error: `Verification error: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export function getSimulatedBlockchainStats() {
  return {
    totalAccounts: blockchainStorage.size,
    accountsCreated: accountCounter - 1000,
    storageSize: JSON.stringify([...blockchainStorage.entries()]).length,
  };
}

export async function clearSimulatedBlockchain() {
  blockchainStorage.clear();
  accountCounter = 1000;
  await saveToFile();
  console.log("🧹 Simulated blockchain cleared");
}

export function getSimulatedStorage() {
  return [...blockchainStorage.entries()];
}