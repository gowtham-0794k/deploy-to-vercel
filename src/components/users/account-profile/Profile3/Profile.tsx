import SubCard from "ui-component/cards/SubCard";
import MenuItem from "@mui/material/MenuItem";
import {
  Grid,
  Avatar,
  Button,
  Stack,
  TextField,
  Typography,
  AnimateButton,
} from "utils/genericExports/theme-imports";
import {
  gridSpacing,
  useState,
} from "utils/genericExports/uiComponentsimports";
import { useDispatch } from "store";
import axios from "axios";
import { BASE_URL } from "shared/constants/routerUrls";
import { openSnackbarFunction } from "utils/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Avatar1 = "/assets/images/users/avatar-1.png";
interface UserDetails {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  phone_no: string;
  dateofbirth: Date;
  email: string;
  gender: string;
  country: string;
  state: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  // States
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    phone_no: "",
    dateofbirth: new Date(),
    email: "",
    gender: "",
    country: "",
    state: "",
  });
  // Fetch latest user details from API
  const fetchUserDetails = async () => {
    try {
      if (!session?.user?.id) return;

      const response = await axios.get(`${BASE_URL}/user/${session.user.id}`);
      if (response.data) {
        setUserDetails(response.data);
        setProfileImage(response.data.profileImage);
      }
    } catch (error) {
      dispatch(openSnackbarFunction("Failed to fetch user details", "error"));
    }
  };

  // Initial fetch of user details
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserDetails();
    }
  }, [session?.user?.id]);
  const handleUpdateDetails = async () => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(userDetails).forEach((key) => {
      formData.append(key, (userDetails as any)[key]);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/user/${session?.user?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.statusText === "OK") {
        setIsEditing(false);
        dispatch(
          openSnackbarFunction(
            response.data.message || "User details updated successfully",
            "success"
          )
        );

        // Fetch latest details from API to ensure consistency
        await fetchUserDetails();
      }
    } catch (error: any) {
      dispatch(openSnackbarFunction("Failed to update user details", "error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files;
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("profileImage", file[0]);

      try {
        const response = await axios.post(
          `${BASE_URL}/user/${session?.user?.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfileImage(response.data.user.profileImage);
        dispatch(
          openSnackbarFunction("Profile image updated successfully", "success")
        );

        // Fetch latest details to ensure consistency
        await fetchUserDetails();
      } catch (error) {
        dispatch(openSnackbarFunction("Failed to upload image", "error"));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form to last saved state
  const handleCancel = () => {
    fetchUserDetails();
    setIsEditing(false);
  };
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item sm={6} md={4}>
        <SubCard title="Profile Picture" contentSX={{ textAlign: "center" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Avatar
                alt="User 1"
                src={profileImage ?? Avatar1}
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="center">
                Upload/Change Your Profile Image
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profileImage"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="profileImage">
                <AnimateButton>
                  <Button variant="contained" size="small" component="span">
                    Upload Avatar
                  </Button>
                </AnimateButton>
              </label>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item sm={6} md={8}>
        <SubCard title="Edit Account Details">
          <Grid container spacing={gridSpacing}>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="First Name"
                value={userDetails.first_name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, first_name: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Last Name"
                value={userDetails.last_name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, last_name: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Address 1"
                value={userDetails.address_1}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, address_1: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Address 2"
                value={userDetails.address_2}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, address_2: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Phone Number"
                value={userDetails.phone_no}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    phone_no: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={dayjs(userDetails.dateofbirth)}
                  onChange={(newValue) =>
                    setUserDetails({
                      ...userDetails,
                      dateofbirth: newValue?.toDate() || new Date(),
                    })
                  }
                  maxDate={dayjs()}
                  disabled={!isEditing}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Gender"
                value={userDetails.gender}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, gender: e.target.value })
                }
                disabled={!isEditing}
                select
                placeholder="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="State/Union Territory"
                value={userDetails.state}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, state: e.target.value })
                }
                disabled={!isEditing}
                select
                placeholder="State/Union Territory"
              >
                <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                <MenuItem value="Arunachal Pradesh">Arunachal Pradesh</MenuItem>
                <MenuItem value="Assam">Assam</MenuItem>
                <MenuItem value="Bihar">Bihar</MenuItem>
                <MenuItem value="Chhattisgarh">Chhattisgarh</MenuItem>
                <MenuItem value="Goa">Goa</MenuItem>
                <MenuItem value="Gujarat">Gujarat</MenuItem>
                <MenuItem value="Haryana">Haryana</MenuItem>
                <MenuItem value="Himachal Pradesh">Himachal Pradesh</MenuItem>
                <MenuItem value="Jharkhand">Jharkhand</MenuItem>
                <MenuItem value="Karnataka">Karnataka</MenuItem>
                <MenuItem value="Kerala">Kerala</MenuItem>
                <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Manipur">Manipur</MenuItem>
                <MenuItem value="Meghalaya">Meghalaya</MenuItem>
                <MenuItem value="Mizoram">Mizoram</MenuItem>
                <MenuItem value="Nagaland">Nagaland</MenuItem>
                <MenuItem value="Odisha">Odisha</MenuItem>
                <MenuItem value="Punjab">Punjab</MenuItem>
                <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                <MenuItem value="Sikkim">Sikkim</MenuItem>
                <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                <MenuItem value="Telangana">Telangana</MenuItem>
                <MenuItem value="Tripura">Tripura</MenuItem>
                <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                <MenuItem value="Uttarakhand">Uttarakhand</MenuItem>
                <MenuItem value="West Bengal">West Bengal</MenuItem>
                <MenuItem value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </MenuItem>
                <MenuItem value="Chandigarh">Chandigarh</MenuItem>
                <MenuItem value="Dadra and Nagar Haveli and Daman and Diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Jammu and Kashmir">Jammu and Kashmir</MenuItem>
                <MenuItem value="Ladakh">Ladakh</MenuItem>
                <MenuItem value="Lakshadweep">Lakshadweep</MenuItem>
                <MenuItem value="Puducherry">Puducherry</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                id="outlined-basic1"
                fullWidth
                label="Country"
                value={userDetails.country}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, country: e.target.value })
                }
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row">
                <AnimateButton>
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      Change Details
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleUpdateDetails}
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Details"}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleCancel}
                        disabled={isLoading}
                        sx={{ ml: 2 }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </AnimateButton>
              </Stack>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};
export default Profile;