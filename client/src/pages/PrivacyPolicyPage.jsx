import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
const PrivacyPolicyPage = () => (
  <InfoPageLayout title="Privacy policy">
    <p>Last updated: {new Date().getFullYear()}</p>
    <p>Outfitopia collects personal information including your name, email, and shipping address to process orders and improve your shopping experience. We do not sell your data to third parties.</p>
    <p>We use cookies to maintain your session and cart. You can disable cookies in your browser settings, though this may affect functionality.</p>
    <p>For questions about your data, contact us at privacy@outfitopia.com.</p>
  </InfoPageLayout>
);
export default PrivacyPolicyPage;
