import { useSelector } from 'react-redux';

// TODO: remove test data
const testLinks = [
    {
        type: 'whatsapp',
        title: 'מתכננים ונהנים',
        description:
            'קבוצת וואצאפ של תושבי השכונה אשר מביעים את דעתם על התכנון העתידי.',
        link: 'https://google.com',
        // actionText: 'הצטרפות לקבוצה',
        // color: '#ADEBD6',
    },
    {
        type: 'facebook',
        title: 'בנייה בשכונת הפרחים - רחובות',
        description:
            'הדף הרשמי לתושבי שכונת הפרחים שאכפת להם מתוכניות הבניה בעיר ובשכונה בפרט ורוצים לעשות שינוי!',
        link: 'https://google.com',
        // actionText: 'מעבר לדף',
        // color: '#90C0F0',
    },
    {
        type: 'web',
        title: 'מתכננים ונהנים',
        description:
            'קבוצת וואצאפ של תושבי השכונה אשר מביעים את דעתם על התכנון העתידי.',
        link: 'https://google.com',
        // actionText: 'לצפייה בקישור',
        // color: '#CFABFA',
    },
];

const Selectors = () => {
    const planData = useSelector((state) => state.plan.planData);
    const dataUnits = useSelector((state) => state.plan.dataUnits);
    const textArea = useSelector((state) => state.plan.textArea);
    const dataArea = useSelector((state) => state.plan.dataArea);

    // const planLinks = useSelector((state) => state.plan.links);
    const planLinks = testLinks;
    // const planLinks = null;

    return {
        planData,
        dataUnits,
        textArea,
        dataArea,
        planLinks,
    };
};

export default Selectors;
