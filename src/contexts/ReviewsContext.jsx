import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addFeedback, subscribeToFeedback } from '../services/database';

const ReviewsContext = createContext(null);

const normalizeFeedback = (items) => {
    if (!Array.isArray(items)) return [];
    return items
        .filter((r) => r && typeof r === 'object')
        .map((r) => {
            const name = typeof r.name === 'string' ? r.name : 'Customer';
            const comment = typeof r.comment === 'string' ? r.comment : '';
            const rating = typeof r.rating === 'number' ? r.rating : 5;
            const avatar = name ? name[0].toUpperCase() : '👤';
            return {
                id: typeof r.id === 'string' || typeof r.id === 'number' ? r.id : `u_${Date.now()}`,
                name,
                comment,
                rating,
                avatar,
                createdAt: typeof r.createdAt === 'string' ? r.createdAt : null,
            };
        })
        .filter((r) => r.comment.trim().length > 0);
};

export const ReviewsProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToFeedback((data) => {
            const normalized = normalizeFeedback(data);
            const sorted = [...normalized].sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            });
            setReviews(sorted);
        });
        return () => unsubscribe();
    }, []);

    const addReview = async ({ name, comment, rating }) => {
        const trimmedName = (name || '').trim();
        const trimmedComment = (comment || '').trim();
        const safeRating = Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5;

        if (!trimmedComment) {
            return null;
        }

        const payload = {
            name: trimmedName || 'Customer',
            comment: trimmedComment,
            rating: safeRating
        };

        await addFeedback(payload);
        return payload;
    };

    const value = useMemo(
        () => ({
            reviews,
            addReview,
        }),
        [reviews]
    );

    return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export const useReviews = () => {
    const ctx = useContext(ReviewsContext);
    if (!ctx) {
        throw new Error('useReviews must be used within a ReviewsProvider');
    }
    return ctx;
};
