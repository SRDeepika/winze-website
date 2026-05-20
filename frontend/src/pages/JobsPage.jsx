app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
    try {
        const jobId = req.params.id;
        const { name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter } = req.body;
        const resume_url = req.file ? `/uploads/${req.file.filename}` : '';
        
        const query = `
            INSERT INTO job_applications (
                job_id, name, email, phone, experience, current_company, 
                current_ctc, notice_period, cover_letter, resume_url, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        `;
        
        await db.query(query, [jobId, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url]);
        
        res.json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
        console.error('Error applying for job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});