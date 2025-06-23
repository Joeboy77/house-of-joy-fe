import { Container, Title, Text, Button, Paper, Stack, Group, ThemeIcon, Center } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

export function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');
  const ticketCode = searchParams.get('ticketCode');

  const isSuccess = status === 'success';

  const handleDownload = () => {
    window.open(`${api.defaults.baseURL}/tickets/code/${ticketCode}/download`, '_blank');
  };

  return (
    <Container my={40}>
      <Center>
        <Paper shadow="md" p="xl" radius="md" withBorder style={{ maxWidth: 500 }}>
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius={80} color={isSuccess ? 'teal' : 'red'}>
              {isSuccess ? (
                <IconCheck style={{ width: '70%', height: '70%' }} />
              ) : (
                <IconX style={{ width: '70%', height: '70%' }} />
              )}
            </ThemeIcon>

            <Stack align="center" gap={0}>
              <Title order={2}>{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</Title>
              <Text c="dimmed" ta="center">
                {isSuccess
                  ? 'Your ticket has been secured. You can download it now.'
                  : 'There was an issue with your payment. Please try again.'}
              </Text>
            </Stack>

            {isSuccess && reference && (
              <Paper withBorder p="sm" radius="sm" w="100%">
                <Text ta="center" size="sm">
                  Payment Reference: <strong>{reference}</strong>
                </Text>
              </Paper>
            )}

            <Group grow w="100%">
              {isSuccess && ticketCode ? (
                <Button component={Link} to={`/tickets/${ticketCode}`} size="md">
                  View Your Ticket
                </Button>
              ) : (
                <Button component={Link} to="/" variant="outline" size="md">
                  Go Back to Home
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
} 