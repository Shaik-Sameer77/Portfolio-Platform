import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, CircularProgress, Tabs, Tab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import {
  fetchEducation, createEducation, updateEducation, deleteEducation, type Education
} from '../features/educationSlice';
import {
  fetchCertifications, createCertification, updateCertification, deleteCertification, type Certification
} from '../features/certificationSlice';

export default function EducationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [tabIndex, setTabIndex] = useState(0);

  // Education state
  const { items: eduItems, loading: eduLoading } = useSelector((state: RootState) => state.education);
  const [eduOpen, setEduOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', startYear: 2020, endYear: 0 });

  // Certification state
  const { items: certItems, loading: certLoading } = useSelector((state: RootState) => state.certification);
  const [certOpen, setCertOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '', url: '', order: 0 });

  useEffect(() => {
    dispatch(fetchEducation());
    dispatch(fetchCertifications());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // --- Education Handlers ---
  const handleOpenEdu = (edu?: Education) => {
    if (edu) {
      setEditingEdu(edu);
      setEduForm({
        institution: edu.institution, degree: edu.degree,
        startYear: edu.startYear || 2020, endYear: edu.endYear || 0
      });
    } else {
      setEditingEdu(null);
      setEduForm({ institution: '', degree: '', startYear: 2020, endYear: 0 });
    }
    setEduOpen(true);
  };

  const handleSaveEdu = () => {
    const payload = {
      ...eduForm,
      endYear: eduForm.endYear === 0 ? undefined : eduForm.endYear
    };
    if (editingEdu) {
      dispatch(updateEducation({ id: editingEdu.id, data: payload }));
    } else {
      dispatch(createEducation(payload));
    }
    setEduOpen(false);
  };

  // --- Certification Handlers ---
  const handleOpenCert = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setCertForm({
        name: cert.name, issuer: cert.issuer, date: cert.date || '', url: cert.url || '', order: cert.order
      });
    } else {
      setEditingCert(null);
      setCertForm({ name: '', issuer: '', date: '', url: '', order: 0 });
    }
    setCertOpen(true);
  };

  const handleSaveCert = () => {
    if (editingCert) {
      dispatch(updateCertification({ id: editingCert.id, data: certForm }));
    } else {
      dispatch(createCertification(certForm));
    }
    setCertOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Education & Certifications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => tabIndex === 0 ? handleOpenEdu() : handleOpenCert()}
        >
          Add {tabIndex === 0 ? 'Education' : 'Certification'}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Education" />
          <Tab label="Certifications" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          {eduLoading ? (
            <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Institution</TableCell>
                  <TableCell>Degree</TableCell>
                  <TableCell>Years</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eduItems.map((edu) => (
                  <TableRow key={edu.id}>
                    <TableCell>{edu.institution}</TableCell>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.startYear} - {edu.endYear || 'Present'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdu(edu)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" onClick={() => dispatch(deleteEducation(edu.id))}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {tabIndex === 1 && (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          {certLoading ? (
            <Box sx={{ display: 'flex', p: 4, justifyContent: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Issuer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certItems.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>{cert.name}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.date}</TableCell>
                    <TableCell>{cert.order}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenCert(cert)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" onClick={() => dispatch(deleteCertification(cert.id))}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {/* Education Dialog */}
      <Dialog open={eduOpen} onClose={() => setEduOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEdu ? 'Edit Education' : 'Add Education'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth type="number" label="Start Year" value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: parseInt(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth type="number" label="End Year (0 for Present)" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: parseInt(e.target.value) || 0 })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEduOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdu}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Certification Dialog */}
      <Dialog open={certOpen} onClose={() => setCertOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCert ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Name" value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Issuer" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Date (e.g. Sep 2024)" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Credential URL" value={certForm.url} onChange={(e) => setCertForm({ ...certForm, url: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="number" label="Order" value={certForm.order} onChange={(e) => setCertForm({ ...certForm, order: parseInt(e.target.value) || 0 })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCert}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
