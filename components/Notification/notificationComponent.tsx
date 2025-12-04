import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '@/constants/theme';
import { Award, BadgeCheck, BriefcaseBusiness, CircleAlert, CircleCheck, Megaphone, MessageCircle, Timer } from 'lucide-react-native';
import moment from 'moment';
interface NotificationComponentProps {
    type: string;
    message: string;
    Clarification: string;
    time: string;
    isRead: boolean;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ type, isRead, message, Clarification, time }) => {
    const renderContent = () => {
        switch (type) {
            case 'newOffer':
                return (
                    <Text numberOfLines={2} style={styles.newOfferText}>
                        {message}
                    </Text>
                );
            case 'followedBusiness':
                return (
                    <Text numberOfLines={2} style={styles.followedBusinessText}>
                        {message}
                    </Text>
                );
            case 'Clarification':
                return (
                    <View style={{ flexDirection: 'column', gap: 10 }}>
                        <Text style={styles.accountClarificationText}>
                            {message}
                        </Text>
                        <Text style={{
                            color: COLORS.gray,
                            fontFamily: FONT.medium,
                            fontSize: SIZES.small,
                            width: '60%',
                        }}>
                            message: {Clarification}
                        </Text>
                    </View>
                );
            default:
                return (
                    <Text  style={styles.defaultText}>
                        {message}
                    </Text>
                );
        }
    };

    return (
        <View style={[styles.container, { opacity: isRead ? 0.8 : 1 }]}>
            <View style={{ flexDirection: 'row', width: '80%', alignItems: 'center', gap: 12 }}>
                <View style={styles.iconContainer}>
                    {
                         type === 'FollowedBusinessAd' ? (
                            <BriefcaseBusiness size={24} color={COLORS.primary} />
                        ) : type === 'Clarification' ? (
                            <MessageCircle size={24} color={COLORS.primary} />
                        ) : type === 'AdApproved' ? (
                            <BadgeCheck size={24} color={COLORS.primary} />
                        ) : type === 'AdExpiryReminder' ? (
                            <Timer size={24} color={COLORS.primary} />
                        ) : type === 'AdRejected' ? (
                            <CircleAlert size={24} color={COLORS.primary} />
                        ) : type === 'ClickMilestone' ? (
                            <Award size={24} color={COLORS.primary} />
                        ) : null
                    }
                </View>
                {renderContent()}
            </View>
            <View style={styles.timeContainer}>
                {/* <Text style={styles.timeText}>{new Date(time).toLocaleDateString()}</Text> */}
                {/* make date like 2 days ago 2hrs ago */}
                <Text style={styles.timeText}>{moment(time).fromNow().includes('days') ? moment(time).fromNow().split(' ')[0] + ' days ago' : moment(time).fromNow().includes('hours') ? moment(time).fromNow().split(' ')[0] + ' hrs ago' : moment(time).fromNow().includes('minutes') ? moment(time).fromNow().split(' ')[0] + ' mins ago' : moment(time).fromNow().includes('seconds') ? moment(time).fromNow().split(' ')[0] + ' secs ago' : moment(time).fromNow()}</Text>
                {/* <Text style={styles.timeText}>{new Date(time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        // margin: 18,
        borderRadius: 16,
        // overflow: 'hidden',
        flex: 1,
        // gap: 12,
        backgroundColor: COLORS.white2,
        justifyContent: 'space-between',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.primary_light,

    },
    newOfferText: {
        color: COLORS.primary,
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
    },
    followedBusinessText: {
        color: COLORS.secondary,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
    },
    accountClarificationText: {
        color: COLORS.tertiary,
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
        width: '60%',
    },
    defaultText: {
        // color: COLORS.gray,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        width: '70%',

    },
    timeContainer: {
        width: '20%',
        // padding: 10,
        // borderRadius: 10,
        // backgroundColor: '#DAEEE8',
    },
    timeText: {
        color: COLORS.gray,
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
    },
});

export default NotificationComponent;
