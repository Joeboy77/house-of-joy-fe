import { AppShell, Burger, Group, Image, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { IconArrowLeft } from '@tabler/icons-react';

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const showGoBackButton = location.pathname !== '/';

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group 
            gap="xs" 
            align="center" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Image src={logo} h={40} w="auto" alt="House of Joy 25" />
            <Text fz={{ base: 'md', sm: 'lg' }} fw={500}>
              House of Joy 25'
            </Text>
          </Group>
        </Group>

        {showGoBackButton && (
          <>
            <Button
              variant="subtle"
              color="gray"
              onClick={() => navigate(-1)}
              leftSection={<IconArrowLeft size={16} />}
              visibleFrom="xs"
            >
              Go Back To Previous Page
            </Button>
            <Button
              variant="subtle"
              color="gray"
              onClick={() => navigate(-1)}
              leftSection={<IconArrowLeft size={16} />}
              hiddenFrom="xs"
            >
              Back
            </Button>
          </>
        )}
      </Group>
    </AppShell.Header>
  );
} 