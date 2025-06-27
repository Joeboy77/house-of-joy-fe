import { Container, Title, Text, Button, Paper, Stack, Group, ThemeIcon, Center, Loader } from '@mantine/core';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { verifyPayment } from '../services/ticketService';
import { notifications } from '@mantine/notifications';

export function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');
  const ticketCode = searchParams.get('ticketCode');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | 'verified'>('pending');

  const isSuccess = status === 'success';

  useEffect(() => {
    // If we have a reference but no clear status, verify the payment
    if (reference && !status) {
      setIsVerifying(true);
      verifyPayment(reference)
        .then(() => {
          setVerificationStatus('verified');
          notifications.show({
            title: '✅ Payment Verified',
            message: 'Your payment has been successfully verified!',
            color: 'green',
            autoClose: 3000,
          });
        })
        .catch(() => {
          setVerificationStatus('failed');
          notifications.show({
            title: '❌ Payment Verification Failed',
            message: 'Unable to verify your payment. Please contact support if you believe this is an error.',
            color: 'red',
            autoClose: 5000,
          });
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else if (status) {
      setVerificationStatus(status === 'success' ? 'success' : 'failed');
    }
  }, [reference, status]);

  const getStatusInfo = () => {
    if (isVerifying) {
      return {
        icon: <Loader size={40} />,
        title: 'Verifying Payment...',
        description: 'Please wait while we verify your payment with Hubtel.',
        color: 'blue' as const,
      };
    }

    if (verificationStatus === 'verified' || isSuccess) {
      return {
        icon: <IconCheck style={{ width: '70%', height: '70%' }} />,
        title: 'Payment Successful!',
        description: 'Your ticket has been secured. You can download it now.',
        color: 'teal' as const,
      };
    }

    if (verificationStatus === 'failed') {
      return {
        icon: <IconX style={{ width: '70%', height: '70%' }} />,
        title: 'Payment Verification Failed',
        description: 'There was an issue verifying your payment. Please contact support if you believe this is an error.',
        color: 'red' as const,
      };
    }

    return {
      icon: <IconAlertCircle style={{ width: '70%', height: '70%' }} />,
      title: 'Payment Status Unknown',
      description: 'We could not determine the status of your payment. Please contact support.',
      color: 'yellow' as const,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Container my={40}>
      <Center>
        <Paper shadow="md" p="xl" radius="md" withBorder style={{ maxWidth: 500 }}>
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius={80} color={statusInfo.color}>
              {statusInfo.icon}
            </ThemeIcon>

            <Stack align="center" gap={0}>
              <Title order={2}>{statusInfo.title}</Title>
              <Text c="dimmed" ta="center">
                {statusInfo.description}
              </Text>
            </Stack>

            {reference && (
              <Paper withBorder p="sm" radius="sm" w="100%">
                <Text ta="center" size="sm">
                  Payment Reference: <strong>{reference}</strong>
                </Text>
              </Paper>
            )}

            <Group grow w="100%">
              {(verificationStatus === 'verified' || isSuccess) && ticketCode ? (
                <Button component={Link} to={`/tickets/${ticketCode}`} size="md">
                  View Your Ticket
                </Button>
              ) : (
                <Button component={Link} to="/" variant="outline" size="md">
                  Go Back to Home
                </Button>
              )}
            </Group>

            {(verificationStatus === 'failed' || verificationStatus === 'pending') && (
              <Text size="xs" c="dimmed" ta="center">
                If you have any questions about your payment, please contact our support team.
              </Text>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
} 