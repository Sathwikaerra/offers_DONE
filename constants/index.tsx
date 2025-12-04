import { UserIcon, BellIcon, ClipboardListIcon, BookmarkIcon, CogIcon, LogOutIcon, Megaphone, Info, MapIcon, Briefcase, InfoIcon, MessageCircle, } from 'lucide-react-native';
import React from 'react';
import { QuestionMarkCircleIcon } from 'react-native-heroicons/solid';
import { COLORS } from './theme';

export const categories = [
    {
        id: 1,
        name: "Sports",
    },
    {
        id: 2,
        name: "Music",
    },
    {
        id: 3,
        name: "Food",
    },
    {
        id: 4,
        name: "Electronics",
    },
];

export const
    sideBarTabs = [
        {
            title: 'My Ads',
            icon: <Megaphone size={16} color={COLORS.primary} />,
            route: '/(routes)/MyAds',
            label: 'My Ads'
        },
        {
            title: 'My Business Profiles',
            icon: <Briefcase size={16} color={COLORS.primary} />,
            route: '/(routes)/myBusinessProfiles',
            label: 'My Business Profiles'
        },
        {
            title: 'Clarification Requests',
            icon: <MessageCircle size={16} color={COLORS.primary} />,
            route: '/clarificationRequests',
            label: 'Clarification Requests'
        },
        {
            title: 'My Profile',
            icon: <UserIcon size={16} color={COLORS.primary} />,
            route: '/profile',
            label: 'MyProfile'
        },
        {
            title: 'New Offers',
            icon: <BellIcon size={16} color={COLORS.primary} />,
            route: '/trending',
            label: 'Trending Offers'
        },
        {
            title: 'All Categories',
            icon: <ClipboardListIcon size={16} color={COLORS.primary} />,
            route: '/all-categories',
            label: 'All Categories'
        },
        {
            title: 'Saved',
            icon: <BookmarkIcon size={16} color={COLORS.primary} />,
            route: '/(drawer)/(tabs)/Saved',
            label: 'Saved'
        },
        {
            title: 'Settings',
            icon: <CogIcon size={16} color={COLORS.primary} />,
            route: '/(drawer)/(tabs)/Settings',
            label: 'Settings'
        },
        {
            title: 'Helps & FAQs',
            icon: <QuestionMarkCircleIcon size={16} color={COLORS.primary} />,
            route: '/HelpsFAQs',
            label: 'Helps & FAQs'
        },

        {
            title: 'Sign Out',
            icon: <LogOutIcon size={16} color={COLORS.primary} />,
            route: '/signout',
            label: 'SignOut'
        },
    ];

export const businessProfileTabs = [
    {
        title: 'About',
        icon: <Info size={16} color={COLORS.white} />,
    },
    {
        title: 'Offers',
        icon: <Megaphone size={16} color={COLORS.white} />,
    }
]

export const BANNER_H = 300;
export const TOPNAVI_H = 50;
export const adsData = [
    {
        id: "sjsrtj",
        title: "Offer 1",
        location: "Lahore",
        expiry: "Expires in 3 days",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "strjsrtj",
        title: "Offer 2",
        location: "Lahore",
        expiry: "Expires in 3 days",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Offer 3",
        location: "Lahore",
        expiry: "Expires in 3 days",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
];

export const categoriesData = [
    {
        id: "sjsrtj",
        title: "Sports",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "strjsrtj",
        title: "Music",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Food",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Electronics",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Food",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Electronics",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Food",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
    {
        id: "ftykrft",
        title: "Electronics",
        image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    },
];

export const sortsAndFilters = [
    {
        name: 'Sort by',
    },
    // {
    //     name: 'Categories',
    // },
    // {
    //     name: 'Businessess',
    // },

];

export const sortOptions = [
    {
        id: 0,
        label: 'View - Lowest to Highest',
        value: 'views',
    },
    {
        id: 1,
        label: 'Clicks - Highest to Lowest',
        value: 'clicks',
    },
    {
        id: 2,
        label: 'Expiry Soon',
        value: 'expiry',
    },
    {
        id: 3,
        label: 'Newest First',
        value: 'createdAt'
    }
];

export const settingsTabs = [
    {
        title: 'Profile',
        icon: <UserIcon size={16} color={COLORS.primary} />,
        route: '/(routes)/profile',
        label: 'Profile'
    },
    {
        title: 'Address Book',
        icon: <MapIcon size={16} color={COLORS.primary} />,
        route: '/(routes)/addressBook',
        label: 'Address Book'
    },
    {
        title: 'About & Policies',
        icon: <InfoIcon size={16} color={COLORS.primary} />,
        route: '/aboutandpolicies',
        label: 'About & Policies'
    },
    {
        title: 'Helps & FAQs',
        icon: <QuestionMarkCircleIcon size={16} color={COLORS.primary} />,
        route: '/(routes)/HelpsFAQs',
        label: 'Helps & FAQs'
    },
    {
        title: 'Sign Out',
        icon: <LogOutIcon size={16} color={COLORS.primary} />,
        route: '/signout',
        label: 'SignOut'
    },
];

export const aboutAndPoliciesTabs = [
    {
        title: 'About',
        icon: <InfoIcon size={16} color={COLORS.primary} />,
        route: '/about',
        label: 'About'
    },
    {
        title: 'Terms & Conditions',
        icon: <InfoIcon size={16} color={COLORS.primary} />,
        route: '/termsandconditions',
        label: 'Terms & Conditions'
    },
    {
        title: 'Privacy Policy',
        icon: <InfoIcon size={16} color={COLORS.primary} />,
        route: '/privacyPolicy',
        label: 'Privacy Policy'
    },
    {
        title: 'Request Account Deletion',
        icon: <InfoIcon size={16} color={COLORS.primary} />,
        route: 'https://forms.gle/KJqDCoVXeT96sF5E9',
        label: 'Request Account Deletion'
    }

]


export const privacypolicyContent = `
Privacy Policy

Last updated: September 28, 2024

This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Privacy Policy Generator.

Interpretation and Definitions

Interpretation

The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.

Definitions

For the purposes of this Privacy Policy:

Account means a unique account created for You to access our Service or parts of our Service.

Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.

Application refers to OffersHolic, the software program provided by the Company.

Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to ZephyrApps Tech Private Limited , PL.NO.35,SY NO.207, Palace View Col,Ali Nagar, Crp Camp (Hyderabad), Bandlaguda, Hyderabad- 500005, Telangana..

Country refers to: Telangana,  India

Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.

Personal Data is any information that relates to an identified or identifiable individual.

Service refers to the Application.

Service Provider means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.

Third-party Social Media Service refers to any website or any social network website through which a User can log in or create an account to use the Service.

Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).

You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.

Collecting and Using Your Personal Data

Types of Data Collected

Personal Data

While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:

Email address
First name and last name
Phone number
Address, State, Province, ZIP/Postal code, City
Usage Data

Usage Data

Usage Data is collected automatically when using the Service.

Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.

When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.

We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.

Information from Third-Party Social Media Services

The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:

Google
Facebook
Twitter
Instagram
Your Personal Data may be shared with:

Business Partners: We may share Your information with Our business partners to offer You certain products, services or promotions.
Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
Other Users: When You share personal information or interact in public areas with other users, such information may be viewed by all users and may be publicly distributed outside.
With Your Consent: We may disclose Your personal information for any other purpose with Your consent.

Retention of Your Personal Data

The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.

Transfer of Your Personal Data

Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.

Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.

Delete Your Personal Data

You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service.

You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.

Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.

Disclosure of Your Personal Data

Business Transactions

If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.

Law enforcement

Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).

Other legal requirements

The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:

Comply with a legal obligation
Protect and defend the rights or property of the Company
Prevent or investigate possible wrongdoing in connection with the Service
Protect the personal safety of Users of the Service or the public
Protect against legal liability

Security of Your Personal Data

The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.

Children's Privacy

Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.

If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.

Links to Other Websites

Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.

We have no control over and assume no responsibility for the content, privacy policies or practices of

any third party sites or services.

Changes to this Privacy Policy

We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.

We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

Contact Us

If you have any questions about this Privacy Policy, You can contact us:

By email: admin@zephyrapps.in

By phone number: 07013396624
`

export const termsOfServiceContent = `
Terms and Conditions

Welcome to ZephyApps Tech Private Limited (Offersholic)! By accessing or using our platform, you agree to comply with these terms and conditions:

Service Description ZephyApps Tech Private Limited (Offersholic) provides a platform for users to discover and avail various offers. Business owners can create profiles to post ads and offers that will be verified by our admin team prior to publication.

Ordering and Payment Users can browse offers through our app and avail them according to the terms set by the business. Payments, if applicable, will be processed through the respective business's payment gateways.

Offer Verification All offers submitted by business owners must be verified by our backend team before being made publicly available. This process ensures that users only see authentic and valid offers.

User Responsibilities Users are responsible for providing accurate and complete information when creating profiles or availing offers. Users must adhere to the platform's usage policies and guidelines.

Intellectual Property All content, trademarks, logos, and other intellectual property displayed on our platform are the property of ZephyApps Tech Private Limited (Offersholic) and may not be used or reproduced without permission.

Limitation of Liability ZephyApps Tech Private Limited (Offersholic) shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use our platform.

Termination ZephyApps Tech Private Limited (Offersholic) reserves the right to terminate or suspend user accounts for any violations of these terms and conditions.

Governing Law These terms and conditions shall be governed by and construed in accordance with the laws of [Your Jurisdiction].

Contact Us If you have any questions or concerns about these terms and conditions, please contact us at info@zephyapps.com.
`

export const aboutContent = `
Welcome to ZephyApps Tech Private Limited (Offersholic)! We are an innovative platform designed to connect users with the latest offers and promotions from various businesses. With a focus on enhancing user experience, we empower users to create their business profiles, allowing them to showcase their ads and offers efficiently.

At Offersholic, we ensure that every offer posted by business owners undergoes a thorough verification process by our backend or admin team before it goes live. This commitment to quality ensures that our users receive only genuine and valuable deals.
`