import { signIn, useSession } from 'next-auth/react';
import router from 'next/router';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

    const { data: session, status } = useSession();

    async function handleSubscribe() {

        if(!session) {
            signIn('github');
            return;
        }

        if(session.activeSubscription) {
            router.push('/posts');
            return;
        }

        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <button
        type='button'
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}

