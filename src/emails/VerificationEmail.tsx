// src/emails/VerificationEmailServer.tsx

import React from 'react';
import VerificationEmail from '../../emails/VerificationEmail';  // Adjust path to correct location

// Create a server-side component that will render the email HTML
export default function VerificationEmailServer({
  username,
  otp
}: {
  username: string;
  otp: string;
}) {
  return <VerificationEmail username={username} otp={otp} />;
}
