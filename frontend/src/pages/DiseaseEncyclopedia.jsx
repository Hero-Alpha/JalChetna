// frontend/src/pages/DiseaseEncyclopedia.jsx


import React, { useState } from 'react';
import { Search, Droplets, Thermometer, Wind, Users, AlertTriangle, Activity, Shield, X, BookOpen } from 'lucide-react';

const DiseaseEncyclopedia = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');

  const diseases = [
    // Bacterial Diseases
    { id: 1, name: 'Cholera', type: 'Bacterial', cause: 'Vibrio cholerae', riskLevel: 'High', symptoms: ['Profuse watery diarrhea', 'Vomiting', 'Rapid dehydration', 'Leg cramps', 'Sunken eyes', 'Low blood pressure'], transmission: 'Contaminated water/food, fecal-oral', prevention: 'Boil water, ORS, cholera vaccine, sanitation', treatment: 'Oral rehydration salts, IV fluids, antibiotics', season: 'Monsoon, post-flood', temp: '>25°C', icon: Droplets },
    { id: 2, name: 'Typhoid Fever', type: 'Bacterial', cause: 'Salmonella typhi', riskLevel: 'High', symptoms: ['Prolonged high fever', 'Headache', 'Abdominal pain', 'Constipation or diarrhea', 'Rose spots', 'Loss of appetite'], transmission: 'Contaminated food/water, carriers', prevention: 'Typhoid vaccine, safe water, hand hygiene', treatment: 'Antibiotics (azithromycin, ceftriaxone)', season: 'Year-round, peaks summer', temp: 'Warm climate', icon: Thermometer },
    { id: 3, name: 'Shigellosis', type: 'Bacterial', cause: 'Shigella species', riskLevel: 'High', symptoms: ['Bloody diarrhea', 'Fever', 'Abdominal cramps', 'Tenesmus', 'Nausea', 'Dehydration'], transmission: 'Fecal-oral, person-to-person', prevention: 'Hand washing, sanitation, safe water', treatment: 'Antibiotics (ciprofloxacin), ORS', season: 'Hot, wet seasons', temp: '>25°C', icon: Wind },
    { id: 4, name: 'Leptospirosis', type: 'Bacterial', cause: 'Leptospira interrogans', riskLevel: 'High', symptoms: ['High fever', 'Severe headache', 'Muscle pain (calves)', 'Jaundice', 'Red eyes', 'Meningitis'], transmission: 'Water contaminated with animal urine', prevention: 'Avoid floodwater, protective clothing', treatment: 'Doxycycline, penicillin, supportive care', season: 'Post-flood, monsoon', temp: 'Warm, humid', icon: Droplets },
    { id: 5, name: 'E. coli Infection', type: 'Bacterial', cause: 'Escherichia coli O157:H7', riskLevel: 'Medium', symptoms: ['Bloody diarrhea', 'Severe stomach cramps', 'Vomiting', 'Low-grade fever', 'Hemolytic uremic syndrome'], transmission: 'Contaminated food/water, undercooked meat', prevention: 'Cook meat thoroughly, safe water, hygiene', treatment: 'Supportive care, no antibiotics', season: 'Summer months', temp: 'Warm', icon: AlertTriangle },
    { id: 6, name: 'Campylobacteriosis', type: 'Bacterial', cause: 'Campylobacter jejuni', riskLevel: 'Medium', symptoms: ['Bloody diarrhea', 'Fever', 'Abdominal pain', 'Nausea', 'Vomiting', 'Guillain-Barré risk'], transmission: 'Undercooked poultry, contaminated water', prevention: 'Cook poultry thoroughly, safe water', treatment: 'Supportive care, antibiotics if severe', season: 'Summer', temp: 'Warm', icon: Thermometer },
    
    // Viral Diseases
    { id: 7, name: 'Hepatitis A', type: 'Viral', cause: 'Hepatitis A virus', riskLevel: 'Medium', symptoms: ['Jaundice', 'Fatigue', 'Nausea', 'Dark urine', 'Clay-colored stool', 'Abdominal pain'], transmission: 'Fecal-oral, contaminated food/water', prevention: 'Hepatitis A vaccine, hand hygiene', treatment: 'Supportive care, rest, hydration', season: 'Year-round', temp: 'All climates', icon: AlertTriangle },
    { id: 8, name: 'Hepatitis E', type: 'Viral', cause: 'Hepatitis E virus', riskLevel: 'Medium', symptoms: ['Jaundice', 'Fatigue', 'Nausea', 'Fever', 'Abdominal pain', 'Pregnant women high risk'], transmission: 'Contaminated water, fecal-oral', prevention: 'Safe water, sanitation', treatment: 'Supportive care, no vaccine widely available', season: 'Monsoon, floods', temp: 'Warm', icon: Activity },
    { id: 9, name: 'Rotavirus', type: 'Viral', cause: 'Rotavirus', riskLevel: 'High', symptoms: ['Severe watery diarrhea', 'Vomiting', 'Fever', 'Dehydration', 'Abdominal pain'], transmission: 'Fecal-oral, contaminated surfaces', prevention: 'Rotavirus vaccine, hand hygiene', treatment: 'ORS, hydration, supportive care', season: 'Winter to spring', temp: 'Cooler', icon: Wind },
    { id: 10, name: 'Norovirus', type: 'Viral', cause: 'Norovirus', riskLevel: 'Medium', symptoms: ['Acute vomiting', 'Watery diarrhea', 'Nausea', 'Stomach cramps', 'Low fever', 'Body aches'], transmission: 'Contaminated food/water, person-to-person', prevention: 'Hand hygiene, surface disinfection', treatment: 'Hydration, rest', season: 'Winter peak', temp: 'Cool', icon: Activity },
    { id: 11, name: 'Adenovirus', type: 'Viral', cause: 'Adenovirus', riskLevel: 'Low', symptoms: ['Watery diarrhea', 'Fever', 'Vomiting', 'Respiratory symptoms', 'Conjunctivitis'], transmission: 'Fecal-oral, respiratory droplets', prevention: 'Hand hygiene, disinfection', treatment: 'Supportive care', season: 'Year-round', temp: 'All', icon: Shield },
    
    // Parasitic Diseases
    { id: 12, name: 'Giardiasis', type: 'Parasitic', cause: 'Giardia lamblia', riskLevel: 'Medium', symptoms: ['Explosive diarrhea', 'Greasy stools', 'Gas', 'Stomach cramps', 'Weight loss', 'Fatigue'], transmission: 'Contaminated water, person-to-person', prevention: 'Boil water, filter water, hand hygiene', treatment: 'Metronidazole, tinidazole', season: 'Year-round', temp: 'All', icon: Droplets },
    { id: 13, name: 'Cryptosporidiosis', type: 'Parasitic', cause: 'Cryptosporidium parvum', riskLevel: 'Medium', symptoms: ['Watery diarrhea', 'Stomach cramps', 'Nausea', 'Low fever', 'Dehydration', 'Weight loss'], transmission: 'Contaminated water (chlorine resistant)', prevention: 'Boil water, avoid swallowing pool water', treatment: 'Supportive care, nitazoxanide', season: 'Summer', temp: 'Warm', icon: AlertTriangle },
    { id: 14, name: 'Amebiasis', type: 'Parasitic', cause: 'Entamoeba histolytica', riskLevel: 'Medium', symptoms: ['Bloody diarrhea', 'Abdominal pain', 'Fever', 'Weight loss', 'Liver abscess possible'], transmission: 'Fecal-oral, contaminated food/water', prevention: 'Safe water, sanitation, hand hygiene', treatment: 'Metronidazole, paromomycin', season: 'Year-round', temp: 'Warm climates', icon: Wind },
    { id: 15, name: 'Cyclosporiasis', type: 'Parasitic', cause: 'Cyclospora cayetanensis', riskLevel: 'Low', symptoms: ['Watery diarrhea', 'Loss of appetite', 'Weight loss', 'Bloating', 'Fatigue', 'Nausea'], transmission: 'Contaminated fresh produce, water', prevention: 'Wash produce, safe water', treatment: 'Trimethoprim-sulfamethoxazole', season: 'Spring-summer', temp: 'Warm', icon: Shield },
    
    // Other Water-Borne
    { id: 16, name: 'Schistosomiasis', type: 'Parasitic', cause: 'Schistosoma species', riskLevel: 'Medium', symptoms: ['Rash', 'Fever', 'Abdominal pain', 'Blood in urine/stool', 'Liver enlargement'], transmission: 'Contact with contaminated freshwater', prevention: 'Avoid swimming in contaminated water', treatment: 'Praziquantel', season: 'Year-round in endemic areas', temp: 'Warm', icon: Droplets },
    { id: 17, name: 'Dracunculiasis', type: 'Parasitic', cause: 'Dracunculus medinensis', riskLevel: 'Low', symptoms: ['Painful skin blister', 'Worm emerging', 'Secondary infection'], transmission: 'Drinking water with infected copepods', prevention: 'Filter water, safe drinking water', treatment: 'Slow worm extraction', season: 'Year-round', temp: 'Tropical', icon: AlertTriangle },
    { id: 18, name: 'Legionellosis', type: 'Bacterial', cause: 'Legionella pneumophila', riskLevel: 'Low', symptoms: ['Pneumonia', 'Fever', 'Cough', 'Shortness of breath', 'Muscle aches'], transmission: 'Inhalation of contaminated water aerosols', prevention: 'Proper maintenance of water systems', treatment: 'Antibiotics (macrolides, quinolones)', season: 'Summer, fall', temp: 'Warm', icon: Wind },
    { id: 19, name: 'Melioidosis', type: 'Bacterial', cause: 'Burkholderia pseudomallei', riskLevel: 'Medium', symptoms: ['Pneumonia', 'Sepsis', 'Abscesses', 'Fever', 'Joint pain'], transmission: 'Contact with contaminated soil/water', prevention: 'Protective gear in endemic areas', treatment: 'Antibiotics (ceftazidime, meropenem)', season: 'Wet season', temp: 'Tropical', icon: Activity },
    { id: 20, name: 'Toxoplasmosis', type: 'Parasitic', cause: 'Toxoplasma gondii', riskLevel: 'Low', symptoms: ['Flu-like symptoms', 'Swollen lymph nodes', 'Muscle aches', 'Eye problems', 'Congenital risks'], transmission: 'Contaminated water, undercooked meat', prevention: 'Safe water, cook meat thoroughly', treatment: 'Pyrimethamine, sulfadiazine', season: 'Year-round', temp: 'All', icon: Shield }
  ];

  const filteredDiseases = diseases.filter(d => 
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.cause.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRisk === 'all' || d.riskLevel === filterRisk)
  );

  const riskColors = {
    High: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    Medium: { bg: '#fffbeb', text: '#eab308', border: '#fde68a' },
    Low: { bg: '#f0fdf4', text: '#22c55e', border: '#bbf7d0' }
  };

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' },
    subtitle: { color: '#475569' },
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
    searchInput: { flex: 1, minWidth: '250px', padding: '0.625rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem' },
    filterGroup: { display: 'flex', gap: '0.5rem' },
    filterBtn: (active) => ({ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, background: active ? '#4f46e5' : '#f1f5f9', color: active ? 'white' : '#475569', border: 'none', cursor: 'pointer' }),
    stats: { fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
    card: (risk) => ({ background: 'white', borderRadius: '0.75rem', border: `1px solid ${riskColors[risk].border}`, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }),
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    cardName: { fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' },
    riskBadge: (risk) => ({ padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.7rem', fontWeight: 500, background: riskColors[risk].bg, color: riskColors[risk].text }),
    cardCause: { fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' },
    cardSymptoms: { display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' },
    symptomPill: { background: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.65rem', color: '#475569' },
    cardType: { fontSize: '0.65rem', color: '#94a3b8' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: 'white', borderRadius: '1rem', maxWidth: '700px', width: '90%', maxHeight: '85vh', overflow: 'auto', padding: '1.5rem' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' },
    closeBtn: { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '0.5rem', cursor: 'pointer' },
    section: { marginBottom: '1rem' },
    sectionTitle: { fontWeight: 'bold', color: '#4f46e5', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' },
    sectionText: { fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' },
    tagList: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' },
    tag: (bg, text) => ({ background: bg, color: text, padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem' })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Disease Encyclopedia</h1>
        <p style={styles.subtitle}>20+ water-borne diseases with symptoms, prevention, and treatment information</p>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by disease, type, or cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterGroup}>
          <button onClick={() => setFilterRisk('all')} style={styles.filterBtn(filterRisk === 'all')}>All</button>
          <button onClick={() => setFilterRisk('High')} style={styles.filterBtn(filterRisk === 'High')}>High Risk</button>
          <button onClick={() => setFilterRisk('Medium')} style={styles.filterBtn(filterRisk === 'Medium')}>Medium Risk</button>
          <button onClick={() => setFilterRisk('Low')} style={styles.filterBtn(filterRisk === 'Low')}>Low Risk</button>
        </div>
      </div>

      <p style={styles.stats}>Showing {filteredDiseases.length} of {diseases.length} diseases</p>

      <div style={styles.grid}>
        {filteredDiseases.map(disease => (
          <div key={disease.id} style={styles.card(disease.riskLevel)} onClick={() => setSelectedDisease(disease)}>
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <disease.icon size={16} color={riskColors[disease.riskLevel].text} />
                <span style={styles.cardName}>{disease.name}</span>
              </div>
              <span style={styles.riskBadge(disease.riskLevel)}>{disease.riskLevel} Risk</span>
            </div>
            <p style={styles.cardCause}>{disease.cause}</p>
            <div style={styles.cardSymptoms}>
              {disease.symptoms.slice(0, 3).map((s, i) => (
                <span key={i} style={styles.symptomPill}>{s}</span>
              ))}
              {disease.symptoms.length > 3 && <span style={styles.symptomPill}>+{disease.symptoms.length - 3}</span>}
            </div>
            <p style={styles.cardType}>{disease.type} • {disease.transmission.substring(0, 40)}...</p>
          </div>
        ))}
      </div>

      {selectedDisease && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDisease(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{selectedDisease.name}</h2>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedDisease.cause} • {selectedDisease.type}</p>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedDisease(null)}>✕</button>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionTitle}>Symptoms</p>
              <div style={styles.tagList}>
                {selectedDisease.symptoms.map((s, i) => (
                  <span key={i} style={styles.tag('#fee2e2', '#991b1b')}>{s}</span>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionTitle}>How It Spreads</p>
              <p style={styles.sectionText}>{selectedDisease.transmission}</p>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionTitle}>Prevention</p>
              <p style={styles.sectionText}>{selectedDisease.prevention}</p>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionTitle}>Treatment</p>
              <p style={styles.sectionText}>{selectedDisease.treatment}</p>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionTitle}>Seasonal Pattern</p>
              <p style={styles.sectionText}>{selectedDisease.season} • Optimal temp: {selectedDisease.temp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseEncyclopedia;