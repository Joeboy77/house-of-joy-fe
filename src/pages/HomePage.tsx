import { Container, Title, Text, SimpleGrid, Card, Image, Group, Paper, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './HomePage.module.css';
import studentTicketImg from '../assets/img/student-ticket.png';
import nonStudentTicketImg from '../assets/img/non-student-ticket.png';

export function HomePage() {
  return (
    <>
      <div className={classes.hero}>
        <Container size="lg">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Purchase Your HOJ 25&apos; Ticket Here 🎉
              </Title>

              <Text className={classes.description} mt={30}>
                Secure your spot at the most exciting events. Easy registration, instant confirmation.
              </Text>

              <Text className={classes.description} mt={10}>
                🎵 Come and enjoy music like never before.....
              </Text>
            </div>
          </div>
        </Container>
      </div>

      <Container size="lg" className={classes.ticketSection}>
        <Paper withBorder shadow="md" p="xl" radius="md">
            <Title order={2} ta="center" mb="xl">
            Ticket Type
            </Title>
            <SimpleGrid cols={1} spacing="xl">
              <Link to="/student-ticket" style={{ textDecoration: 'none' }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                    <Image
                        src={studentTicketImg}
                        alt="Student Ticket"
                    />
                    </Card.Section>
                    <Group justify="space-between" mt="md" align="center">
                        <Text fz="sm">Special discounted rate for students with valid ID</Text>
                        <Group align="center" gap={5}>
                            <ThemeIcon color="green" size={20} radius="xl">
                                <IconCheck style={{ width: '70%', height: '70%' }} />
                            </ThemeIcon>
                            <Text fz="xs" c="dimmed">Student verification required</Text>
                        </Group>
                    </Group>
                </Card>
              </Link>
              <Link to="/non-student-ticket" style={{ textDecoration: 'none' }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                    <Image
                        src={nonStudentTicketImg}
                        alt="Non-Student Ticket"
                    />
                    </Card.Section>
                    <Group justify="space-between" mt="md" align="center">
                        <Text fz="sm">Standard ticket for general admission</Text>
                        <Group align="center" gap={5}>
                            <ThemeIcon color="green" size={20} radius="xl">
                                <IconCheck style={{ width: '70%', height: '70%' }} />
                            </ThemeIcon>
                            <Text fz="xs" c="dimmed">Instant confirmation</Text>
                        </Group>
                    </Group>
                </Card>
              </Link>
            </SimpleGrid>
        </Paper>
      </Container>
    </>
  );
} 