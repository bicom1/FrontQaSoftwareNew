import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PpcForm = () => {
    const [load, setLoad] = useState(false);
    const [ppc, setPpc] = useState({
        leadId: '',
        mod: '',
        source: '',
        agentName: '',
        teamleader: '',
        greetings: '',
        accuracy: '',
        building: '',
        presenting: '',
        concern: '',
        closing: '',
        numberOfFollow: '',
        leadQuality: '',
        QcCategory: '',
        summary: '',
    });

    const handlerChangePpc = (name, value) => {
        setPpc((pre) => ({
            ...pre,
            [name]: value
        }));
    };

    const handlerPpcForm = async () => {
        setLoad(true);
        
        // Check if all fields are filled
        if (
            ppc.leadId.trim() === '' ||
            ppc.mod.trim() === '' ||
            ppc.source.trim() === '' ||
            ppc.agentName.trim() === '' ||
            ppc.teamleader.trim() === '' ||
            ppc.greetings.trim() === '' ||
            ppc.accuracy.trim() === '' ||
            ppc.building.trim() === '' ||
            ppc.presenting.trim() === '' ||
            ppc.concern.trim() === '' ||
            ppc.closing.trim() === '' ||
            ppc.numberOfFollow.trim() === '' ||
            ppc.leadQuality.trim() === '' ||
            ppc.QcCategory.trim() === '' ||
            ppc.summary.trim() === ''
        ) {
            alert("Please fill all fields!");
            setLoad(false);
            return;
        } else {
            // Simulate API call with timeout
            setTimeout(() => {
                setPpc({
                    leadId: '',
                    mod: '',
                    source: '',
                    agentName: '',
                    teamleader: '',
                    greetings: '',
                    accuracy: '',
                    building: '',
                    presenting: '',
                    concern: '',
                    closing: '',
                    numberOfFollow: '',
                    leadQuality: '',
                    QcCategory: '',
                    summary: '',
                });
                alert("Successfully Created!");
                setLoad(false);
            }, 2000);
        }
    };

    const LoadingSpinner = () => (
        <div className="spinner-border spinner-border-sm text-light" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    console.log("ppc", ppc);

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        {/* Header */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center py-5">
                                <h1 className="display-4 fw-bold text-dark">BI COMM</h1>
                                <h3 className="text-success h4 mt-3">
                                    Quality Control - Form Lead enquiry reference to the sales agent
                                </h3>
                            </div>
                        </div>

                        {/* Lead ID */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <label className="form-label fw-medium">Enter Lead Id:</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Lead Id"
                                    required 
                                    className="form-control"
                                    value={ppc.leadId}
                                    onChange={(e) => handlerChangePpc('leadId', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Mode of Communication */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Mode of Communication</h3>
                                <div className="d-grid gap-2">
                                    {['Form', 'Call', 'Wazzup/Whatsapp', 'Live Chats', 'Facebook', 'Instagram'].map((option) => (
                                        <div key={option} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="moc" 
                                                value={option} 
                                                checked={ppc.mod === option}
                                                onChange={(e) => handlerChangePpc('mod', e.target.value)}
                                                className="form-check-input"
                                                id={`moc-${option}`}
                                            />
                                            <label className="form-check-label" htmlFor={`moc-${option}`}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Source */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Source</h3>
                                <div className="d-grid gap-2">
                                    {[
                                        { value: 'ppc dubai 0', label: 'PPC Dubai 0' },
                                        { value: 'ppc fahad dubai', label: 'PPC Fahad Dubai' },
                                        { value: 'ppc fawad livechat', label: 'PPC Fawad Livechat' }
                                    ].map((option) => (
                                        <div key={option.value} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="source" 
                                                value={option.value} 
                                                checked={ppc.source === option.value}
                                                onChange={(e) => handlerChangePpc('source', e.target.value)}
                                                className="form-check-input"
                                                id={`source-${option.value}`}
                                            />
                                            <label className="form-check-label" htmlFor={`source-${option.value}`}>
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Agent Name */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <label className="form-label fw-medium">Enter Agent Name:</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Agent Name"
                                    required 
                                    className="form-control"
                                    value={ppc.agentName}
                                    onChange={(e) => handlerChangePpc('agentName', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Team Leader */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Team Leader</h3>
                                <div className="d-grid gap-2">
                                    {[
                                        { value: 'fawad ali (erc dubai)', label: 'Fawad Ali (ERC Dubai)' },
                                        { value: 'muhammad abdullah akram (erc abu dhabi)', label: 'Muhammad Abdullah Akram (ERC Abu Dhabi)' },
                                        { value: 'muhammad abubakar (dynamic)', label: 'Muhammad Abubakar (Dynamic)' },
                                        { value: 'yousef almaani (jordan)', label: 'Yousef Almaani (Jordan)' }
                                    ].map((option) => (
                                        <div key={option.value} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="teamlead" 
                                                value={option.value} 
                                                checked={ppc.teamleader === option.value}
                                                onChange={(e) => handlerChangePpc('teamleader', e.target.value)}
                                                className="form-check-input"
                                                id={`teamlead-${option.value}`}
                                            />
                                            <label className="form-check-label" htmlFor={`teamlead-${option.value}`}>
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Greetings */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Greetings</h3>
                                <div className="d-grid gap-2">
                                    {['Excellent', 'Good', 'Fair', 'Poor'].map((option) => (
                                        <div key={option} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="greeting" 
                                                value={option.toLowerCase()} 
                                                checked={ppc.greetings === option.toLowerCase()}
                                                onChange={(e) => handlerChangePpc('greetings', e.target.value)}
                                                className="form-check-input"
                                                id={`greeting-${option}`}
                                            />
                                            <label className="form-check-label" htmlFor={`greeting-${option}`}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Accuracy & Compliance */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Accuracy & Compliance</h3>
                                <div className="d-grid gap-2">
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="ac" 
                                            value="ask clear" 
                                            checked={ppc.accuracy === 'ask clear'}
                                            onChange={(e) => handlerChangePpc('accuracy', e.target.value)}
                                            className="form-check-input"
                                            id="ac-clear"
                                        />
                                        <label className="form-check-label" htmlFor="ac-clear">
                                            Ask clear, concise questions to accurately identify customer needs or inquiries.
                                        </label>
                                    </div>
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="ac" 
                                            value="not up to mark" 
                                            checked={ppc.accuracy === 'not up to mark'}
                                            onChange={(e) => handlerChangePpc('accuracy', e.target.value)}
                                            className="form-check-input"
                                            id="ac-notmark"
                                        />
                                        <label className="form-check-label" htmlFor="ac-notmark">
                                            Not up to the mark
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Building Rapport & Discovery */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Building Rapport & Discovery</h3>
                                <div className="d-grid gap-2">
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="bpd" 
                                            value="use open ended" 
                                            checked={ppc.building === 'use open ended'}
                                            onChange={(e) => handlerChangePpc('building', e.target.value)}
                                            className="form-check-input"
                                            id="bpd-open"
                                        />
                                        <label className="form-check-label" htmlFor="bpd-open">
                                            Use open-ended questions to understand customer needs, showing active listening.
                                        </label>
                                    </div>
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="bpd" 
                                            value="not up to mark" 
                                            checked={ppc.building === 'not up to mark'}
                                            onChange={(e) => handlerChangePpc('building', e.target.value)}
                                            className="form-check-input"
                                            id="bpd-notmark"
                                        />
                                        <label className="form-check-label" htmlFor="bpd-notmark">
                                            Not up to the mark
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Presenting Solutions & Making the Sale */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Presenting Solutions & Making the Sale</h3>
                                <div className="d-grid gap-2">
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="psm" 
                                            value="professionally handle" 
                                            checked={ppc.presenting === 'professionally handle'}
                                            onChange={(e) => handlerChangePpc('presenting', e.target.value)}
                                            className="form-check-input"
                                            id="psm-professional"
                                        />
                                        <label className="form-check-label" htmlFor="psm-professional">
                                            Professionally handle objections and guide customers to schedule appointments.
                                        </label>
                                    </div>
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="psm" 
                                            value="not up to mark" 
                                            checked={ppc.presenting === 'not up to mark'}
                                            onChange={(e) => handlerChangePpc('presenting', e.target.value)}
                                            className="form-check-input"
                                            id="psm-notmark"
                                        />
                                        <label className="form-check-label" htmlFor="psm-notmark">
                                            Not up to the mark
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Addressing The Client Concern */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Addressing The Client Concern</h3>
                                <div className="d-grid gap-2">
                                    {['Good', 'Satisfactory', 'Poor'].map((option) => (
                                        <div key={option} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="acc" 
                                                value={option} 
                                                checked={ppc.concern === option}
                                                onChange={(e) => handlerChangePpc('concern', e.target.value)}
                                                className="form-check-input"
                                                id={`acc-${option}`}
                                            />
                                            <label className="form-check-label" htmlFor={`acc-${option}`}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Call Closing & Securing Commitment */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Call Closing & Securing Commitment</h3>
                                <div className="d-grid gap-2">
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="ccsc" 
                                            value="scheduling callbacks" 
                                            checked={ppc.closing === 'scheduling callbacks'}
                                            onChange={(e) => handlerChangePpc('closing', e.target.value)}
                                            className="form-check-input"
                                            id="ccsc-scheduling"
                                        />
                                        <label className="form-check-label" htmlFor="ccsc-scheduling">
                                            Summarize key points and outline next steps (scheduling callbacks or appointments).
                                        </label>
                                    </div>
                                    <div className="form-check p-2 hover-bg-light rounded">
                                        <input 
                                            type="radio" 
                                            name="ccsc" 
                                            value="not up to mark" 
                                            checked={ppc.closing === 'not up to mark'}
                                            onChange={(e) => handlerChangePpc('closing', e.target.value)}
                                            className="form-check-input"
                                            id="ccsc-notmark"
                                        />
                                        <label className="form-check-label" htmlFor="ccsc-notmark">
                                            Not up to the mark
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Number Follow Up */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <label className="form-label fw-medium">Number Follow Up (If Any):</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Number Follow Up"
                                    required 
                                    className="form-control"
                                    value={ppc.numberOfFollow}
                                    onChange={(e) => handlerChangePpc('numberOfFollow', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Lead Quality */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">Lead Quality</h3>
                                <div className="d-grid gap-2">
                                    {['Interested', 'Interested in Other Procedure', 'Not Interested', "Can't Afford", 'Spam'].map((option) => (
                                        <div key={option} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="leadquality" 
                                                value={option} 
                                                checked={ppc.leadQuality === option}
                                                onChange={(e) => handlerChangePpc('leadQuality', e.target.value)}
                                                className="form-check-input"
                                                id={`leadquality-${option}`}
                                            />
                                            <label className="form-check-label" htmlFor={`leadquality-${option}`}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* QC Category */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5 fw-semibold mb-3">QC Category</h3>
                                <div className="d-grid gap-2">
                                    {['Late Response', 'Unresponsive', 'Wrongly Marked', 'Duplicate Lead'].map((option) => (
                                        <div key={option} className="form-check p-2 hover-bg-light rounded">
                                            <input 
                                                type="radio" 
                                                name="qc" 
                                                value={option} 
                                                checked={ppc.QcCategory === option}
                                                onChange={(e) => handlerChangePpc('QcCategory', e.target.value)}
                                                className="form-check-input"
                                                id={`qc-${option}`}
                                            />
                                            <label className="form-check-label" htmlFor={`qc-${option}`}>
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <label className="form-label fw-medium">Summary:</label>
                                <textarea 
                                    placeholder="Enter Summary"
                                    required 
                                    rows="4"
                                    className="form-control"
                                    value={ppc.summary}
                                    onChange={(e) => handlerChangePpc('summary', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <button 
                                    type="button" 
                                    className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2" 
                                    onClick={handlerPpcForm} 
                                    disabled={load}
                                >
                                    Submit {load && <LoadingSpinner />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-bg-light:hover {
                    background-color: var(--bs-gray-100) !important;
                }
            `}</style>
        </div>
    );
};

export default PpcForm;