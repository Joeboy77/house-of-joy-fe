import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  ThemeIcon,
  Center,
  Loader,
  Alert,
  Button,
  Avatar,
  Divider,
  ActionIcon,
  Badge,
  Box,
  SimpleGrid,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconLocation,
  IconUser,
  IconInfoCircle,
  IconDownload,
  IconSchool,
  IconBook,
  IconId,
} from '@tabler/icons-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketByCode, TicketDetailsResponse } from '../services/ticketService';
import api from '../services/api';

function DetailItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Group gap="sm" align="flex-start">
      <ThemeIcon variant="light" size={40} radius="md">
        {icon}
      </ThemeIcon>
      <div>
        <Text size="xs" c="dimmed">{title}</Text>
        <Text size="sm" fw={500}>{children}</Text>
      </div>
    </Group>
  );
}

export function TicketDetailsPage() {
  const { ticketCode } = useParams<{ ticketCode: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketCode) {
      getTicketByCode(ticketCode)
        .then((response) => {
          setTicket(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Could not fetch ticket details. Please check the code and try again.');
          setLoading(false);
        });
    }
  }, [ticketCode]);

  if (loading) {
    return <Center h="100vh"><Loader /></Center>;
  }

  if (error) {
    return (
      <Container my={40}>
        <Alert icon={<IconAlertCircle size={20} />} title="Error!" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!ticket) {
    return <Center h={400}><Text>Ticket not found.</Text></Center>;
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}/tickets/code/${ticketCode}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HOJ25_Ticket_${ticketCode}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const ticketId = ticket.ticketCode.split('-').pop();

  return (
    <Box py="xl" px="md">
      <Container size="sm" p={0}>
        <Paper bg="dark.8" radius="lg" style={{ overflow: 'hidden' }}>
          <Group justify="space-between" p="md" bg="dark.6">
            <ActionIcon onClick={() => navigate(-1)} variant="subtle" c="white" size="lg">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Stack align="center" gap={0}>
              <Title order={4} c="white">Event Ticket</Title>
              <Text size="xs" c="dimmed">Valid Entry Pass</Text>
            </Stack>
            <Badge variant="outline" color="white">TICKET ID: {ticketId}</Badge>
          </Group>

          <Stack p={{ base: 'md', sm: 'xl' }} gap="xl">
            {/* Attendee Details */}
            <Paper withBorder p="md" radius="md">
              <Text fw={500} mb="sm">Attendee Details</Text>
              <Group>
                <Avatar size="lg" radius="xl" />
                <div>
                  <Text fw={500}>{ticket.fullName}</Text>
                  <Text size="sm" c="dimmed">{ticket.email}</Text>
                </div>
              </Group>
            </Paper>

            <Group grow>
              {/* Ticket Type */}
              <Paper withBorder p="md" radius="md" ta="center">
                <Text size="xs" c="dimmed">TICKET TYPE</Text>
                <Badge color="red" size="lg">{ticket.ticketType}</Badge>
              </Paper>
            </Group>

            {/* Student Information - Only show for student tickets */}
            {ticket.ticketType === 'STUDENT' && (
              <Paper withBorder p="lg" radius="md">
                <Text fw={500} mb="md">Student Information</Text>
                <Stack gap="md">
                  {ticket.institutionName && (
                    <DetailItem icon={<IconSchool size={20} />} title="Institution">
                      {ticket.institutionName}
                    </DetailItem>
                  )}
                  {ticket.courseOfStudy && (
                    <DetailItem icon={<IconBook size={20} />} title="Course of Study">
                      {ticket.courseOfStudy}
                    </DetailItem>
                  )}
                  {ticket.studentIdNumber && (
                    <DetailItem icon={<IconId size={20} />} title="Student ID Number">
                      {ticket.studentIdNumber}
                    </DetailItem>
                  )}
                </Stack>
              </Paper>
            )}

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xl">
              {/* QR Code */}
              <Paper withBorder p="xl" radius="md" ta="center">
                <Text size="xs" c="dimmed">SCAN TO VERIFY</Text>
                <Center my="lg">
                  <QRCodeCanvas value={ticket.ticketCode} size={140} />
                </Center>
              </Paper>

              {/* Unique Code */}
              <Paper withBorder p="xl" radius="md" ta="center" bg="red.9">
                <Text size="xs" c="red.1">UNIQUE TICKET CODE</Text>
                <Title order={3} c="white" my="lg" style={{ wordBreak: 'break-all' }}>{ticket.ticketCode}</Title>
                <Text size="xs" c="red.2">Keep this code secure</Text>
              </Paper>
            </SimpleGrid>

            {/* Event Info */}
            <Paper withBorder p="lg" radius="md">
              <Text fw={500} mb="md">Event Information</Text>
              <Stack gap="md">
                <DetailItem icon={<IconCalendar size={20} />} title="Event">
                  House of Joy 2025 <br /> <Text span c="dimmed" size="sm">Biennial Music Event</Text>
                </DetailItem>
                <DetailItem icon={<IconClock size={20} />} title="Date & Time">
                  August 2, 2025 <br /> <Text span c="dimmed" size="sm">9:00 AM - 6:00 PM (GMT)</Text>
                </DetailItem>
                <DetailItem icon={<IconLocation size={20} />} title="Venue">
                  National Theatre <br /> <Text span c="dimmed" size="sm">South Liberia Road, Accra</Text>
                </DetailItem>
                <DetailItem icon={<IconUser size={20} />} title="Ticket Type">
                  {ticket.ticketType} <br /> <Text span c="dimmed" size="sm">Please arrive 30 minutes early</Text>
                </DetailItem>
              </Stack>
            </Paper>

            {/* Important Info */}
            <Alert color="yellow" icon={<IconInfoCircle size={20} />} title="Important Information">
              <Text component="ul" size="sm" pl="lg">
                <li>Present this ticket at the entrance</li>
                <li>Valid ID required for verification</li>
                <li>Non-transferable and non-refundable</li>
                <li>Screenshots not accepted - original ticket required</li>
              </Text>
            </Alert>

            <Divider my="sm" label={`Generated on: ${new Date(ticket.createdAt).toLocaleDateString()}`} labelPosition="center" />
          </Stack>
        </Paper>
        <Button
          color="dark"
          leftSection={<IconDownload size={20} />}
          onClick={handleDownload}
          fullWidth
          mt="lg"
        >
          Save to Device
        </Button>
      </Container>
    </Box>
  );
} 