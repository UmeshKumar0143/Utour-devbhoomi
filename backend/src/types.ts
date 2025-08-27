// src/types/index.ts

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  gender?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface TripData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  aadhaarNumber: string;
  gender: string;
  profileImage?: string;
  entryPoint: string;
  expectedExitDate?: string;
  emergencyContacts?: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
}

export interface BlockchainUser {
  name: string;
  aadhaar: string;
}

export interface BlockchainResult {
  blockchainAddress: string;
  verificationHash: string;
  transactionSignature?: string;
}

export interface VerificationResult {
  valid: boolean;
  userData: any | null;
  reason: string;
}