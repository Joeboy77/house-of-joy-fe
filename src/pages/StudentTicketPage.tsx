import {
  Box,
  Button,
  Container,
  FileButton,
  Grid,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  Stack,
  Divider,
  Image
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser, IconDeviceMobile, IconLock, IconFileText } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { notifications } from "@mantine/notifications";
import { purchaseStudentTicket, checkStudentStatus } from "../services/ticketService";
import { VerificationPendingOverlay } from "../components/VerificationPendingOverlay";
import { useNavigate } from "react-router-dom";

const StudentTicketPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [statusCheckLoading, setStatusCheckLoading] = useState(false);
  const ticketPrice = 50.0;
  const total = ticketPrice;
  const navigate = useNavigate();

  useEffect(() => {
    const pendingEmail = localStorage.getItem("hoj_pending_email");
    if (pendingEmail) {
      setIsPending(true);
    }
  }, []);

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      institutionName: "",
      courseOfStudy: "",
      studentIdNumber: "",
      studentDocument: null,
    },
    validate: {
      fullName: (value) =>
        value.trim().length >= 3 ? null : "Full name is required",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phoneNumber: (value) =>
        value.trim().length >= 10 ? null : "Phone number is required",
      institutionName: (value) =>
        value.trim().length > 0 ? null : "Institution name is required",
      courseOfStudy: (value) =>
        value.trim().length > 0 ? null : "Course of study is required",
      studentIdNumber: (value) =>
        value.trim().length > 0 ? null : "Student ID number is required",
      studentDocument: () => (file ? null : "Student ID Proof is required"),
    },
  });

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      form.setFieldValue("studentDocument", selectedFile as any);
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null); // Not an image, no preview
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message || "An error occurred. Please try again.";
    
    // Handle common validation errors
    if (message.includes("Phone number must be a valid Ghanaian number")) {
      return "Please enter a valid Ghanaian phone number. Use format: 0244123456 or +233244123456";
    }
    
    if (message.includes("already has a ticket")) {
      return "You already have a ticket for this event. Please check your email for details.";
    }
    
    if (message.includes("already have a pending student application")) {
      return "You already have a pending application. Please wait for verification or check your email.";
    }
    
    if (message.includes("already have a paid ticket")) {
      return "You already have a paid ticket for this event. Please check your email for your ticket.";
    }
    
    if (message.includes("Validation failed")) {
      return "Please check your information and try again. Make sure all required fields are filled correctly.";
    }
    
    // Default fallback
    return message;
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!file) {
      form.validate();
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("institutionName", values.institutionName);
    formData.append("courseOfStudy", values.courseOfStudy);
    formData.append("studentIdNumber", values.studentIdNumber);
    formData.append("document", file);

    try {
      await purchaseStudentTicket(formData);
      localStorage.setItem("hoj_pending_email", values.email);
      setIsPending(true);
    } catch (error: any) {
      const userFriendlyMessage = getErrorMessage(error);
      notifications.show({
        title: "⚠️ Application Error",
        message: userFriendlyMessage,
        color: "red",
        autoClose: 5000,
        withCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setStatusCheckLoading(true);
    const email = localStorage.getItem("hoj_pending_email");

    if (!email) {
      notifications.show({
        title: "Error",
        message: "Could not find your application details. Please try again.",
        color: "red",
      });
      localStorage.removeItem("hoj_pending_email");
      setIsPending(false);
      setStatusCheckLoading(false);
      return;
    }

    try {
      const response = await checkStudentStatus(email);
      const { status, paymentUrl } = response.data;

      if (status === "APPROVED") {
        notifications.show({
          title: "🎉 Application Approved!",
          message: "Your student application has been approved! Redirecting to payment...",
          color: "green",
          autoClose: 2000,
          withCloseButton: true,
        });
        localStorage.removeItem("hoj_pending_email");
        
        // Keep overlay visible and redirect immediately
        setTimeout(() => {
          if (paymentUrl && paymentUrl.trim() !== "") {
            window.location.href = paymentUrl;
          } else {
            setIsPending(false);
            notifications.show({
              title: "Payment Link Error",
              message: "Payment link not available. Please contact support.",
              color: "red",
            });
          }
        }, 1000); // Reduced delay for faster redirect
      } else if (status === "REJECTED") {
        notifications.show({
          title: "❌ Application Rejected",
          message:
            "Unfortunately, your application was not approved. Please check your email for more details. Redirecting to home...",
          color: "red",
          autoClose: 4000,
          withCloseButton: true,
        });
        localStorage.removeItem("hoj_pending_email");
        setTimeout(() => {
          setIsPending(false); // Hide overlay
          navigate('/'); // Redirect to home
        }, 3000);
      } else {
        // PENDING
        notifications.show({
          title: "⏳ Still Pending",
          message:
            "Your application is still under review. Please check back later.",
          color: "orange",
          autoClose: 4000,
          withCloseButton: true,
        });
      }
    } catch (error) {
      notifications.show({
        title: "⚠️ Error",
        message: "Could not check status. Please try again later.",
        color: "red",
        autoClose: 4000,
        withCloseButton: true,
      });
    } finally {
      setStatusCheckLoading(false);
    }
  };

  if (isPending) {
    return (
      <VerificationPendingOverlay
        opened={isPending}
        onCheckStatus={handleCheckStatus}
        loading={statusCheckLoading}
      />
    );
  }

  return (
    <Box>
      <Box className={classes.hero}>
        <Container size="lg">
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Purchase Your HOJ 25' Ticket Here 🎉
              </Title>
              <Text className={classes.description} mt={30}>
                Secure your spot at the most exciting events. Easy registration,
                instant confirmation.
              </Text>
              <Text className={classes.description} mt={10}>
                🎶 Come and enjoy music like never before.....
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
                <Title order={2}>Student Ticket</Title>
                <Text c="dimmed">Fill in your details to purchase your ticket</Text>
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
                      {...form.getInputProps("fullName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Email Address"
                      placeholder="your.email@example.com"
                      required
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="0244123456 or +233244123456"
                      required
                      {...form.getInputProps("phoneNumber")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Institution Name"
                      placeholder="Enter your institution name"
                      required
                      {...form.getInputProps("institutionName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Course of Study"
                      placeholder="Enter your course of study"
                      required
                      {...form.getInputProps("courseOfStudy")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Student ID Number"
                      placeholder="Enter your student ID number"
                      required
                      {...form.getInputProps("studentIdNumber")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text size="sm" fw={500} mb={3}>
                      Student ID/Proof of Registration
                    </Text>
                    {!file ? (
                      <FileButton
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,application/pdf"
                      >
                        {(props) => (
                          <Button {...props} variant="default" fullWidth>
                            <Text
                              fz={{ base: "xs", sm: "sm" }}
                              visibleFrom="sm"
                            >
                              Upload Student ID or Proof of Registration
                            </Text>
                            <Text
                              fz={{ base: "xs", sm: "sm" }}
                              hiddenFrom="sm"
                            >
                              Upload ID/Proof
                            </Text>
                          </Button>
                        )}
                      </FileButton>
                    ) : (
                      <Paper withBorder p="sm" radius="md">
                        <Group>
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              w={50}
                              h={50}
                              radius="md"
                            />
                          ) : (
                            <IconFileText size={40} />
                          )}
                          <Stack gap={0}>
                            <Text size="sm" fw={500}>
                              {file.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {(file.size / 1024).toFixed(2)} KB
                            </Text>
                          </Stack>
                          <Button
                            variant="subtle"
                            color="red"
                            onClick={handleRemoveFile}
                            style={{ marginLeft: "auto" }}
                          >
                            Remove
                          </Button>
                        </Group>
                      </Paper>
                    )}
                    {form.errors.studentDocument && (
                      <Text c="red" size="sm" mt={5}>
                        {form.errors.studentDocument}
                      </Text>
                    )}
                  </Grid.Col>
                </Grid>
              </Stack>

              <Paper withBorder p="md" radius="md" bg="green.0">
                <Stack>
                  <Group>
                    <IconDeviceMobile />
                    <Text fw={500}>Payment Method</Text>
                  </Group>
                  <Paper withBorder p="md" radius="sm" bg="white">
                    <Group>
                      <IconDeviceMobile />
                      <Stack gap={0}>
                        <Text fw={500} size="sm">
                          Mobile Money Payment
                        </Text>
                        <Text size="xs" c="dimmed">
                           Secure & Fast
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                </Stack>
              </Paper>

              <Stack>
                <Text fw={500}>Order Summary</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Ticket Type:</Text>
                    <Text size="sm">Student</Text>
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
                  style={{ backgroundColor: "#401516" }}
                >
                  <Text size="md" visibleFrom="sm">
                    Proceed to Secure Payment
                  </Text>
                  <Text size="xs" hiddenFrom="sm">
                    Proceed to Payment
                  </Text>
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentTicketPage; 