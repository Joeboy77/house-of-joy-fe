import { Modal, Text, Button, Stack, ThemeIcon, Title, Loader } from '@mantine/core';
import { IconCircleCheck, IconClock } from '@tabler/icons-react';

interface VerificationPendingOverlayProps {
  opened: boolean;
  onCheckStatus: () => void;
  loading: boolean;
}

export function VerificationPendingOverlay({ opened, onCheckStatus, loading }: VerificationPendingOverlayProps) {

  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Intentionally empty to prevent closing
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      padding="xl"
    >
      <Stack align="center" gap="xl" py={{ base: 'md', sm: 'xl' }}>
        <ThemeIcon color="orange" size={80} radius="xl">
          <IconClock size={60} />
        </ThemeIcon>
        
        <Stack align="center" gap="xs">
            <Title order={2} ta="center">Application Pending</Title>
            <Text ta="center" size="lg">Your request is under review.</Text>
        </Stack>

        <Text ta="center" c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          Our team is currently verifying your student information. Once approved, you will receive an email containing a secure link to complete your payment.
        </Text>

        <Stack w="100%" mt="lg">
           <Button onClick={onCheckStatus} size="md" fullWidth leftSection={loading ? <Loader size="sm" color="white" /> : <IconCircleCheck size={20} />}>
                <Text size="sm" visibleFrom="sm">Check Verification Status</Text>
                <Text size="xs" hiddenFrom="sm">Check Status</Text>
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
} 