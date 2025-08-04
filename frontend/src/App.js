import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

// Pull from environment variable, fallback to HTTPS just in case
const API_BASE = process.env.REACT_APP_API_BASE || 
  "https://sandual-bcfjb2ddghhbh8hd.eastus2-01.azurewebsites.net";

function App() {
  const [bubbles, setBubbles] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    adjustment_type: "inbound",
    quantity: "",
    notes: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch bubbles
  const fetchBubbles = async () => {
  try {
    const url = `${API_BASE}/bubbles`;
    console.log("Fetching from:", url);
    const res = await axios.get(url);
    console.log("Response:", res.data);
    setBubbles(res.data);
  } catch (err) {
    console.error("Error fetching bubbles:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Status:", err.response.status);
    }
  }
};

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editId) {
      setEditData({ ...editData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add bubble
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${API_BASE}/bubbles`;
      console.log("Posting to:", url); // Debug log

      await axios.post(
        url,
        {
          product_name: formData.product_name,
          adjustment_type: formData.adjustment_type,
          quantity: parseFloat(formData.quantity),
          notes: formData.notes,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setFormData({
        product_name: "",
        adjustment_type: "inbound",
        quantity: 0,
        notes: "",
      });

      fetchBubbles();
    } catch (err) {
      console.error("Error sending bubble:", err);
      alert("There was a problem sending the bubble. Check console for details.");
    }
  };

  // Delete bubble
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/bubbles/${id}`);
      fetchBubbles();
    } catch (err) {
      console.error("Error deleting bubble:", err);
    }
  };

  // Edit bubble
  const handleEdit = (bubble) => {
    setEditId(bubble.id);
    setEditData(bubble);
  };

  // Save bubble
  const handleSave = async (id) => {
    try {
      await axios.put(`${API_BASE}/bubbles/${id}`, editData, {
        headers: { "Content-Type": "application/json" },
      });
      setEditId(null);
      setEditData({});
      fetchBubbles();
    } catch (err) {
      console.error("Error saving bubble:", err);
    }
  };

  useEffect(() => {
    fetchBubbles();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bubble Inventory Tracker
      </Typography>

      {/* Add form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Product Name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Select
              name="adjustment_type"
              value={formData.adjustment_type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="inbound">Inbound</MenuItem>
              <MenuItem value="outbound">Outbound</MenuItem>
              <MenuItem value="adjustment">Adjustment</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Bubble
        </Button>
      </form>

      {/* Bubble list */}
      <Grid container spacing={2}>
        {bubbles.length === 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No bubbles found.
          </Typography>
        )}
        {bubbles.map((bubble) => (
          <Grid item xs={12} key={bubble.id}>
            <Card>
              <CardContent>
                {editId === bubble.id ? (
                  <>
                    <TextField
                      name="product_name"
                      value={editData.product_name}
                      onChange={handleChange}
                      fullWidth
                      label="Product Name"
                    />
                    <Select
                      name="adjustment_type"
                      value={editData.adjustment_type}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      <MenuItem value="inbound">Inbound</MenuItem>
                      <MenuItem value="outbound">Outbound</MenuItem>
                      <MenuItem value="adjustment">Adjustment</MenuItem>
                    </Select>
                    <TextField
                      name="quantity"
                      type="number"
                      value={editData.quantity}
                      onChange={handleChange}
                      fullWidth
                      label="Quantity"
                      sx={{ mt: 1 }}
                    />
                    <TextField
                      name="notes"
                      value={editData.notes}
                      onChange={handleChange}
                      fullWidth
                      label="Notes"
                      sx={{ mt: 1 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{bubble.product_name}</Typography>
                    <Typography>
                      {bubble.adjustment_type} - {bubble.quantity}
                    </Typography>
                    <Typography variant="body2">{bubble.notes}</Typography>
                    <Typography variant="caption">{bubble.created_at}</Typography>
                  </>
                )}
              </CardContent>
              <CardActions>
                {editId === bubble.id ? (
                  <IconButton onClick={() => handleSave(bubble.id)} color="success">
                    <Save />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEdit(bubble)} color="primary">
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDelete(bubble.id)} color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;