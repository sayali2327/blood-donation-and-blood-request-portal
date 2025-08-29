import Donor from '../models/Donor.js';
import Request from '../models/Request.js';
import { notifyDonorMatched, notifyRecipientOnAccept } from '../utils/notify.js';

/** GET /api/donor/me */
export async function getMe(req, res) {
  const donor = await Donor.findById(req.donorId);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  res.json(donor);
}

/** PUT /api/donor/profile */
export async function updateProfile(req, res) {
  const allowed = ['name','age','gender','bloodGroup','contact','location','availability','lastDonationDate'];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const donor = await Donor.findByIdAndUpdate(req.donorId, updates, { new: true, upsert: true });
  res.json(donor);
}

/** GET /api/donor/requests?radiusKm=5 */
export async function matchingRequests(req, res) {
  const donor = await Donor.findById(req.donorId);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  const radiusKm = Math.min(Number(req.query.radiusKm || 5), 50);
  const meters = radiusKm * 1000;

  const query = {
    status: 'pending',
    bloodGroup: donor.bloodGroup,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: donor.location.coordinates },
        $maxDistance: meters
      }
    }
  };

  const requests = await Request.find(query).limit(50);
  res.json({ requests });
}

/** POST /api/donor/requests/:id/accept */
export async function acceptRequest(req, res) {
  const { id } = req.params;
  const reqDoc = await Request.findOne({ _id: id, status: 'pending' });
  if (!reqDoc) return res.status(404).json({ error: 'Request not found or already handled' });

  reqDoc.status = 'assigned';
  reqDoc.donorId = req.donorId;
  await reqDoc.save();

  // Notify both sides (placeholder)
  const donor = await (await Donor.findById(req.donorId));
  await notifyDonorMatched({
    donorEmail: donor?.contact?.email,
    recipientPhone: 'hidden',
    hospital: reqDoc.hospital
  });
  await notifyRecipientOnAccept({
    recipientContact: 'hidden',
    donorMasked: { name: donor?.name?.slice(0, 1) + '***', phone: donor?.contact?.phone?.slice(0, 3) + '****' },
    hospital: reqDoc.hospital
  });

  res.json({ ok: true, request: reqDoc });
}

/** POST /api/donor/requests/:id/reject */
export async function rejectRequest(req, res) {
  const { id } = req.params;
  const reqDoc = await Request.findOne({ _id: id });
  if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
  // A donor rejection just skips; we could log it for analytics.
  res.json({ ok: true });
}

/** GET /api/donor/history */
export async function history(req, res) {
  const items = await Request.find({ donorId: req.donorId }).sort({ createdAt: -1 }).limit(100);
  res.json({ history: items });
}
