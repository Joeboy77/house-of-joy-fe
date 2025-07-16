import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Group,
  Button,
  Stack,
  Divider,
  Grid,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser, IconDeviceMobile, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { purchaseNonStudentTicket } from '../services/ticketService';
import classes from './HomePage.module.css';
import vipImg from '../assets/img/vip.jpeg';

export function VipTicketPage() {
  const [loading, setLoading] = useState(false);
  const ticketPrice = 200.0;
  const total = ticketPrice;

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Full name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phoneNumber: (value) =>
        value.length < 10 ? 'Phone number must have at least 10 digits' : null,
    },
  });

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message || "An error occurred. Please try again.";
    if (message.includes("Phone number must be a valid Ghanaian number")) {
      return "Please enter a valid Ghanaian phone number. Use format: 0244123456 or +233244123456";
    }
    if (message.includes("Validation failed")) {
      return "Please check your information and try again. Make sure all required fields are filled correctly.";
    }
    if (message.includes("Hubtel credentials")) {
      return "Payment system is temporarily unavailable. Please try again later or contact support.";
    }
    if (message.includes("Hubtel API error")) {
      return "Payment gateway error. Please try again or contact support if the issue persists.";
    }
    return message;
  };

  const handleSubmit = async (values: { fullName: string; email: string; phoneNumber: string }) => {
    setLoading(true);
    try {
      const response: { data: { paymentUrl: string } } = await purchaseNonStudentTicket({ ...values, ticketType: 'VIP' });
      window.location.href = response.data.paymentUrl;
    } catch (error: any) {
      const userFriendlyMessage = getErrorMessage(error);
      notifications.show({
        title: '⚠️ Purchase Failed',
        message: userFriendlyMessage,
        color: 'red',
        autoClose: 5000,
        withCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box className={classes.hero}>
        <Container size="lg">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Purchase Your VIP Ticket 🎟️
              </Title>
              <Text className={classes.description} mt={30}>
                Enjoy premium seating, exclusive access, and more. Limited VIP tickets available!
              </Text>
            </div>
          </div>
        </Container>
      </Box>

      <Container size="md" my="xl">
        <Paper withBorder shadow="md" p="xl" radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="xl">
              <Stack gap={0} align="center">
                <Title order={2} color="yellow.9">VIP Ticket</Title>
                <Text c="dimmed">Fill in your details to purchase your VIP ticket</Text>
              </Stack>

              <Stack>
                <Group>
                  <IconUser />
                  <Text fw={500}>Personal Information</Text>
                </Group>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                      {...form.getInputProps('fullName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Email Address"
                      placeholder="your.email@example.com"
                      required
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Phone Number"
                      placeholder="0244123456 or +233244123456"
                      required
                      {...form.getInputProps('phoneNumber')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>

              <Paper withBorder p="md" radius="md" bg="yellow.0">
                <Group>
                  <img src={vipImg} alt="VIP Ticket" style={{ width: 80, borderRadius: 8 }} />
                  <Text fw={500} color="yellow.9">VIP Ticket: Includes premium seating and exclusive access!</Text>
                </Group>
              </Paper>

              <Stack>
                <Text fw={500}>Order Summary</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Ticket Type:</Text>
                    <Text size="sm">VIP</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Price:</Text>
                    <Text size="sm">Gh {ticketPrice.toFixed(2)}</Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={500}>Total:</Text>
                    <Text fw={500}>Gh {total.toFixed(2)}</Text>
                  </Group>
                </Stack>
              </Stack>
              <Group justify="center" mt="xl">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={loading}
                  leftSection={<IconLock size={18} />}
                  style={{ backgroundColor: '#FFD700', color: '#401516' }}
                >
                  <Text fz={{base: 'xs', sm: 'md'}} visibleFrom="sm">Proceed to Secure Payment</Text>
                  <Text fz={{base: 'xs', sm: 'md'}} hiddenFrom="sm">Proceed to Payment</Text>
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
} 