import { ActionIcon, Group, TextInput, Button, Title, Text, Container, Stack, Divider } from '@mantine/core';
import { IconBrandYoutube, IconBrandTiktok, IconBrandInstagram, IconMail } from '@tabler/icons-react';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container>
        <Stack align="center" gap="xl">
            <Stack align="center" gap={0}>
                <Title order={2} c="white">House of Joy Ticketing</Title>
                <Text size="sm" c="dimmed">
                    Stay updated with our events!
                </Text>
            </Stack>

            <Group>
                <TextInput
                    w={300}
                    leftSection={<IconMail size={16} />}
                    placeholder="Enter Your Email"
                />
                <Button color="hoj-yellow">Subscribe</Button>
            </Group>

            <Group>
                <Text c="white">Follow Us:</Text>
                <ActionIcon component="a" href="#" size="lg" color="gray" variant="subtle">
                    <IconBrandYoutube />
                </ActionIcon>
                <ActionIcon component="a" href="#" size="lg" color="gray" variant="subtle">
                    <IconBrandTiktok />
                </ActionIcon>
                <ActionIcon component="a" href="#" size="lg" color="gray" variant="subtle">
                    <IconBrandInstagram />
                </ActionIcon>
            </Group>
        </Stack>

        <Divider my="xl" color="gray.8" />

        <Text c="dimmed" size="sm" ta="center">
            © 2025 House of Joy Ticketing. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
} 