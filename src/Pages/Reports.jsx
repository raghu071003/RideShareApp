import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all reports when the component mounts
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/v1/admin/allReports',{withCredentials:true});
                console.log(response.data);
                
                if (response.data.success) {
                    setReports(response.data.reports);
                } else {
                    setError('No reports found.');
                }
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to fetch reports data.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Reports</h1>

            {loading ? (
                <p>Loading reports data...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : reports.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Ride ID</th>
                            <th className="border border-gray-300 px-4 py-2">Driver ID</th>
                            <th className="border border-gray-300 px-4 py-2">Driver Name</th>
                            <th className="border border-gray-300 px-4 py-2">Driver Contact</th>
                            <th className="border border-gray-300 px-4 py-2">Report Details</th>
                            <th className="border border-gray-300 px-4 py-2">Report Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{report.ride_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.driver_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.driver_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.driver_contact}</td>
                                <td className="border border-gray-300 px-4 py-2">{report.report_details}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(report.report_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reports to display.</p>
            )}
        </div>
    );
};

export default ReportPage;
