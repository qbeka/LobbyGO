import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { QueueTicket } from '../../../types';
import { COLORS } from '../../../constants';

interface QueueTicketCardProps {
  ticket: QueueTicket;
  onCancel: () => void;
}

const QueueTicketCard = ({ ticket, onCancel }: QueueTicketCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return COLORS.WARNING;
      case 'matched':
        return COLORS.SUCCESS;
      case 'consumed':
        return COLORS.SUCCESS;
      case 'cancelled':
        return COLORS.ERROR;
      case 'expired':
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'In line';
      case 'matched':
        return 'Matched!';
      case 'consumed':
        return 'Joined';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.bossName}>
            {ticket.boss_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>
              {getStatusText(ticket.status)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {ticket.status === 'waiting' && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Waiting for other trainers to queue for the same boss...
          </Text>
        </View>
      )}

      {ticket.status === 'matched' && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You've been matched! Check your notifications.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 12,
  },
  bossName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.TEXT_LIGHT,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },
});

export default QueueTicketCard;
