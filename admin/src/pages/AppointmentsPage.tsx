import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { VideoCall, CheckCircle, Cancel, Edit, Delete } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../store';
import {
  fetchAppointments, updateAppointmentStatus, fetchSlots, createSlot, deleteSlot,
  fetchBlockedDates, createBlockedDate, deleteBlockedDate
} from '../features/appointmentSlice';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AppointmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, slots, blockedDates, loading } = useSelector((state: RootState) => state.appointments);
  
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);

  // Slot Form
  const [slotForm, setSlotForm] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
  
  // Blocked Date Form
  const [blockForm, setBlockForm] = useState({ date: '', reason: '' });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchSlots());
    dispatch(fetchBlockedDates());
  }, [dispatch]);

  const handleStatusChange = (id: number, status: string) => {
    dispatch(updateAppointmentStatus({ id, status }));
  };

  const handleAddSlot = () => {
    dispatch(createSlot({ ...slotForm }));
  };

  const handleAddBlock = () => {
    dispatch(createBlockedDate({ ...blockForm }));
    setBlockForm({ date: '', reason: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Appointments</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Upcoming Bookings" />
          <Tab label="Weekly Availability" />
          <Tab label="Blocked Dates" />
        </Tabs>
      </Paper>

      {/* TAB 0: Upcoming Bookings */}
      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Type / Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {new Date(appt.scheduledAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appt.timezone})
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{appt.clientName}</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }} color="textSecondary">{appt.clientEmail}</Typography>
                    {appt.clientCompany && <Typography variant="caption" color="textSecondary">{appt.clientCompany}</Typography>}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={appt.type} color="primary" variant="outlined" sx={{ mb: 0.5 }} />
                    <Typography variant="caption" sx={{ display: 'block' }} color="textSecondary">{appt.duration} mins</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={appt.status} 
                      color={appt.status === 'CONFIRMED' ? 'success' : appt.status === 'CANCELLED' ? 'error' : 'default'} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    {appt.meetingUrl && (
                      <IconButton color="primary" onClick={() => window.open(appt.meetingUrl, '_blank')} title="Join Meet">
                        <VideoCall />
                      </IconButton>
                    )}
                    {appt.status !== 'CANCELLED' && (
                      <IconButton color="error" onClick={() => handleStatusChange(appt.id, 'CANCELLED')} title="Cancel">
                        <Cancel />
                      </IconButton>
                    )}
                    <Button size="small" onClick={() => { setSelectedAppt(appt); setOpenDialog(true); }}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No appointments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* TAB 1: Weekly Availability */}
      {tab === 1 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Add Availability Slot</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Day of Week</InputLabel>
                <Select value={slotForm.dayOfWeek} label="Day of Week" onChange={(e) => setSlotForm({...slotForm, dayOfWeek: Number(e.target.value)})}>
                  {daysOfWeek.map((day, i) => <MenuItem key={i} value={i}>{day}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth type="time" label="Start Time" size="small" sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }}
                value={slotForm.startTime} onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})} />
              <TextField fullWidth type="time" label="End Time" size="small" sx={{ mb: 3 }} slotProps={{ inputLabel: { shrink: true } }}
                value={slotForm.endTime} onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})} />
              <Button variant="contained" fullWidth onClick={handleAddSlot}>Add Slot</Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Time Window</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{daysOfWeek[slot.dayOfWeek]}</TableCell>
                      <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                      <TableCell align="right">
                        <IconButton color="error" size="small" onClick={() => dispatch(deleteSlot(slot.id))}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {slots.length === 0 && (
                    <TableRow><TableCell colSpan={3} align="center">No availability defined. Calendar is closed.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* TAB 2: Blocked Dates */}
      {tab === 2 && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Block a Specific Date</Typography>
              <TextField fullWidth type="date" label="Date" size="small" sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }}
                value={blockForm.date} onChange={(e) => setBlockForm({...blockForm, date: e.target.value})} />
              <TextField fullWidth label="Reason (Optional)" size="small" sx={{ mb: 3 }}
                value={blockForm.reason} onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})} />
              <Button variant="contained" fullWidth onClick={handleAddBlock} disabled={!blockForm.date}>Block Date</Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockedDates.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell>{new Date(block.date).toLocaleDateString()}</TableCell>
                      <TableCell>{block.reason || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton color="error" size="small" onClick={() => dispatch(deleteBlockedDate(block.id))}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blockedDates.length === 0 && (
                    <TableRow><TableCell colSpan={3} align="center">No blocked dates.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedAppt && (
          <>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="textSecondary">Client Information</Typography>
              <Typography><strong>Name:</strong> {selectedAppt.clientName}</Typography>
              <Typography><strong>Email:</strong> {selectedAppt.clientEmail}</Typography>
              {selectedAppt.clientCompany && <Typography><strong>Company:</strong> {selectedAppt.clientCompany}</Typography>}
              
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Message / Agenda</Typography>
              <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'background.default' }}>
                <Typography variant="body2">{selectedAppt.clientMessage || 'No message provided.'}</Typography>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
