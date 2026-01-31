export interface LegalContent {
  // Privacy Policy
  privacyPolicy: {
    title: string
    lastUpdated: string
    sections: Array<{
      id: string
      heading: string
      content: string
    }>
  }
  
  // Terms of Service
  termsOfService: {
    title: string
    lastUpdated: string
    sections: Array<{
      id: string
      heading: string
      content: string
    }>
  }
  
  // Cookie Policy
  cookiePolicy: {
    title: string
    lastUpdated: string
    sections: Array<{
      id: string
      heading: string
      content: string
    }>
  }
}

export const defaultLegalContent: LegalContent = {
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'January 31, 2026',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        content: 'At ClearUp ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.'
      },
      {
        id: 'information-we-collect',
        heading: 'Information We Collect',
        content: 'We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, participate in activities on the website, or otherwise contact us. This includes: name, email address, phone number, company name, and any other information you choose to provide.'
      },
      {
        id: 'how-we-use-information',
        heading: 'How We Use Your Information',
        content: 'We use the information we collect to: provide, operate, and maintain our website and services; improve, personalize, and expand our services; understand and analyze how you use our website; develop new products, services, features, and functionality; communicate with you for customer service, updates, and marketing purposes; process your transactions; and find and prevent fraud.'
      },
      {
        id: 'information-sharing',
        heading: 'Information Sharing and Disclosure',
        content: 'We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. We may also share information to comply with legal obligations, protect our rights, or in connection with a business transfer.'
      },
      {
        id: 'data-security',
        heading: 'Data Security',
        content: 'We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.'
      },
      {
        id: 'your-rights',
        heading: 'Your Privacy Rights',
        content: 'Depending on your location, you may have certain rights regarding your personal information, including: the right to access, correct, or delete your personal data; the right to restrict or object to processing; the right to data portability; and the right to withdraw consent. To exercise these rights, please contact us using the information provided below.'
      },
      {
        id: 'contact-us',
        heading: 'Contact Us',
        content: 'If you have questions or comments about this Privacy Policy, please contact us at: privacy@clearup.com'
      }
    ]
  },
  termsOfService: {
    title: 'Terms of Service',
    lastUpdated: 'January 31, 2026',
    sections: [
      {
        id: 'agreement',
        heading: 'Agreement to Terms',
        content: 'By accessing or using our website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.'
      },
      {
        id: 'use-license',
        heading: 'Use License',
        content: 'Permission is granted to temporarily access the materials (information or software) on ClearUp\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose; attempt to decompile or reverse engineer any software; remove any copyright or other proprietary notations; or transfer the materials to another person.'
      },
      {
        id: 'services',
        heading: 'Our Services',
        content: 'ClearUp provides digital marketing services including video production, content creation, and marketing strategy. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of our services.'
      },
      {
        id: 'user-responsibilities',
        heading: 'User Responsibilities',
        content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to: provide accurate and complete information; maintain the security of your account; notify us immediately of any unauthorized use; and comply with all applicable laws and regulations.'
      },
      {
        id: 'intellectual-property',
        heading: 'Intellectual Property',
        content: 'The content, features, and functionality of our website and services, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, and software, are owned by ClearUp and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.'
      },
      {
        id: 'limitation-liability',
        heading: 'Limitation of Liability',
        content: 'In no event shall ClearUp, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.'
      },
      {
        id: 'governing-law',
        heading: 'Governing Law',
        content: 'These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.'
      },
      {
        id: 'changes',
        heading: 'Changes to Terms',
        content: 'We reserve the right to modify or replace these Terms at any time at our sole discretion. By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms.'
      },
      {
        id: 'contact',
        heading: 'Contact Information',
        content: 'If you have any questions about these Terms of Service, please contact us at: legal@clearup.com'
      }
    ]
  },
  cookiePolicy: {
    title: 'Cookie Policy',
    lastUpdated: 'January 31, 2026',
    sections: [
      {
        id: 'what-are-cookies',
        heading: 'What Are Cookies',
        content: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how their site is being used.'
      },
      {
        id: 'how-we-use-cookies',
        heading: 'How We Use Cookies',
        content: 'We use cookies for several purposes: to enable certain functions of our website; to provide analytics; to store your preferences; to enable advertisement delivery, including behavioral advertising; and to remember your login details. We use both session cookies (which expire when you close your browser) and persistent cookies (which stay on your device until you delete them).'
      },
      {
        id: 'types-of-cookies',
        heading: 'Types of Cookies We Use',
        content: 'Essential Cookies: These are necessary for the website to function properly and cannot be switched off. Performance Cookies: These help us understand how visitors interact with our website by collecting and reporting information anonymously. Functionality Cookies: These enable the website to provide enhanced functionality and personalization. Marketing Cookies: These are used to track visitors across websites to display relevant advertisements.'
      },
      {
        id: 'third-party-cookies',
        heading: 'Third-Party Cookies',
        content: 'In addition to our own cookies, we may also use various third-party cookies to report usage statistics of our services and deliver advertisements. These include analytics services like Google Analytics, and marketing platforms that help us understand our audience and improve our marketing efforts.'
      },
      {
        id: 'managing-cookies',
        heading: 'Managing Cookies',
        content: 'Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may impact your overall user experience. You can manage your cookie preferences through your browser settings. Most browsers allow you to: see what cookies you have and delete them individually; block third-party cookies; block cookies from particular sites; block all cookies; and delete all cookies when you close your browser.'
      },
      {
        id: 'cookie-consent',
        heading: 'Cookie Consent',
        content: 'When you first visit our website, you will be shown a cookie consent banner. By clicking "Accept All Cookies," you consent to the use of all cookies described in this policy. You can change your cookie preferences at any time by accessing our cookie settings.'
      },
      {
        id: 'updates',
        heading: 'Updates to This Policy',
        content: 'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or for other reasons. Any changes will be posted on this page with an updated revision date.'
      },
      {
        id: 'contact',
        heading: 'Contact Us',
        content: 'If you have any questions about our use of cookies, please contact us at: cookies@clearup.com'
      }
    ]
  }
}


