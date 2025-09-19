import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  Paper,
  IconButton,
  Chip,
  useMediaQuery
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Masonry from '@mui/lab/Masonry';

const MaterialUI = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showImg, setShowImg] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [searched, setSearched] = useState(false); // show/hide Home button

  // Detect mobile devices
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch Unsplash photos
  const getUnsplashPhotos = async () => {
    try {
      const res = await axios.get(
        "https://api.unsplash.com/photos?page=1&per_page=30&client_id=LGb5pAoJkPl2KArxL0dimdalqE_84mySDGpIY1eqNOA"
      );
      setPhotos(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlerSearchImage = async () => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${search}&client_id=LGb5pAoJkPl2KArxL0dimdalqE_84mySDGpIY1eqNOA`
      );
      setPhotos(res?.data?.results);
      setSearched(true); // show Home after searching
    } catch (error) {
      console.log(error);
    }
  };

  const homeIconBack = async () => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/photos?page=1&per_page=30&client_id=LGb5pAoJkPl2KArxL0dimdalqE_84mySDGpIY1eqNOA`
      );
      setPhotos(res.data);
      setSearched(false); // hide Home after going back
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUnsplashPhotos();
  }, []);

  const showModalImage = (item) => {
    setSelectItem(item);
    setShowImg(true);
  };

  return (
    <Box sx={{ fontFamily: "Roboto, sans-serif" }}>
      {/* Modal */}
      <Modal
        open={showImg}
        onClose={() => setShowImg(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0,0,0,0.85)"
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", top: 5, right: 5, color: "white", zIndex: 10 }}
            onClick={() => setShowImg(false)}
          >
            <CloseIcon />
          </IconButton>
          <img
            style={{ maxHeight: "80vh", maxWidth: "90vw", borderRadius: 8 }}
            src={selectItem?.urls?.regular}
            alt=""
          />
          <Box sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            bgcolor: "rgba(0,0,0,0.5)",
            px: 1.5,
            py: 0.5,
            borderRadius: 1
          }}>
            <Typography variant="caption" color="white">
              {selectItem?.user?.name} | Unsplash
            </Typography>
          </Box>
        </Box>
      </Modal>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="primary.main"
        color="white"
        p={3}
        sx={{ borderRadius: "0 0 10px 10px" }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Free Image Gallery
        </Typography>

        {/* Home Button (only visible after search) */}
        {searched && (
          <Button
            onClick={homeIconBack}
            variant="contained"
            color="secondary"
            sx={{ ml: 2, p: "10px" }}
          >
            {isMobile ? (
              <HomeIcon sx={{ padding: "1px" }} />
            ) : (
              "Back To Home"
            )}
          </Button>
        )}
      </Box>

      {/* Search Box */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} p={3} flexWrap="wrap">
        <TextField
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "300px", md: "400px" },
            bgcolor: "background.paper",
            borderRadius: 1
          }}
          variant="outlined"
          size="small"
          onKeyDown={(e) => e.key === "Enter" && handlerSearchImage()} // Search on Enter
        />
        <Button onClick={handlerSearchImage} variant="contained" color="primary">
          Search
        </Button>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Masonry Gallery
        <Box sx={{ p: 2 }}>
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {photos.map((img) => (
              <Paper
                key={img.id}
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover img": { transform: "scale(1.05)" },
                  transition: "transform 0.3s"
                }}
                onClick={() => showModalImage(img)}
              >
                <img
                  src={img?.urls?.small}
                  alt={img.alt_description}
                  style={{ width: "100%", display: "block", transition: "transform 0.3s" }}
                />
                {/* Hover overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "white",
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 1 }
                  }}
                >
                  <Typography variant="caption">{img.user.name}</Typography>
                  <Chip label="Unsplash" size="small" sx={{ bgcolor: "primary.main", color: "white" }} />
                </Box>
              </Paper>
            ))}
          </Masonry>
        </Box>
      )}
    </Box>
  );
};

export default MaterialUI;
