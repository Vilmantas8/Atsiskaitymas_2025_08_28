import React, { useState, useEffect, useRef } from 'react';
import './EnhancedBookingForm.css';

const EnhancedBookingForm = ({ onSubmit = null, onBookingCreated = null, onClose = null, booking = null }) => {
  const [formData, setFormData] = useState({
    movieTitle: '',
    cinemaName: '',
    city: '',
    date: '',
    time: '',
    seats: 50,
    stageSquares: 50,
    selectedSeats: []
  });

  const [showCinemaSuggestions, setShowCinemaSuggestions] = useState(false);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const cinemaInputRef = useRef(null);

  // Kino teatrų duomenų bazė su realistiniais duomenimis
  const cinemaDatabase = [
    // Klaipėda
    { id: 1, name: 'Forum Cinemas Arena', city: 'Klaipėda', capacity: 900 },
    { id: 2, name: 'Atlantis Cinema', city: 'Klaipėda', capacity: 450 },
    { id: 3, name: 'Klaipėdos Kino Centras', city: 'Klaipėda', capacity: 350 },
    
    // Vilnius  
    { id: 4, name: 'Forum Cinema Mega', city: 'Vilnius', capacity: 1500 },
    { id: 5, name: 'Coca-Cola Plaza', city: 'Vilnius', capacity: 1200 },
    { id: 6, name: 'Skalvijos Kinas', city: 'Vilnius', capacity: 800 },
    { id: 7, name: 'Forum Cinemas Vingis', city: 'Vilnius', capacity: 600 },
    
    // Kaunas
    { id: 8, name: 'Forum Cinemas Akropolis', city: 'Kaunas', capacity: 1100 },
    { id: 9, name: 'Cinema Park Mega', city: 'Kaunas', capacity: 950 },
    { id: 10, name: 'Apollo Kino', city: 'Kaunas', capacity: 700 },
    
    // Šiauliai  
    { id: 11, name: 'Forum Cinemas Šiauliai', city: 'Šiauliai', capacity: 650 },
    { id: 12, name: 'Saulės Kinas', city: 'Šiauliai', capacity: 400 },
    
    // Panevėžys
    { id: 13, name: 'Forum Cinemas Panevėžys', city: 'Panevėžys', capacity: 550 },
    { id: 14, name: 'Panevėžio Kino Teatras', city: 'Panevėžys', capacity: 380 }
  ];

  // Generuoti vietų variantus pagal kino teatro talpą
  const generateSeatOptions = (capacity) => {
    const options = [];
    const baseOptions = [50, 100, 200, 300, 500, 800, 1000, 1500];
    
    baseOptions.forEach(option => {
      if (option <= capacity) {
        options.push(option);
      }
    });
    
    // Pridėti tikslią talpą, jei jos nėra pagrindinių variantų sąraše
    if (!options.includes(capacity)) {
      options.push(capacity);
      options.sort((a, b) => a - b);
    }
    
    return options;
  };

  // Generuoti kino salės vietų išdėstymą
  const generateSeatLayout = (totalSeats) => {
    const seatsPerRow = 20; // Standartinis kino salės eilės plotis
    const rows = Math.ceil(totalSeats / seatsPerRow);
    const layout = [];
    
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, ir t.t.
      const rowSeats = [];
      
      const seatsInThisRow = Math.min(seatsPerRow, totalSeats - (row * seatsPerRow));
      
      for (let seat = 1; seat <= seatsInThisRow; seat++) {
        rowSeats.push(`${rowLetter}${seat}`);
      }
      
      if (rowSeats.length > 0) {
        layout.push({
          row: rowLetter,
          seats: rowSeats
        });
      }
    }
    
    return layout;
  };

  // Tvarkyti vietų pasirinkimą
  const handleSeatClick = (seatId) => {
    setFormData(prev => {
      const currentSelected = prev.selectedSeats || [];
      
      if (currentSelected.includes(seatId)) {
        // Pašalinti vietą, jei jau pasirinkta
        return {
          ...prev,
          selectedSeats: currentSelected.filter(seat => seat !== seatId)
        };
      } else {
        // Pridėti vietą, jei nepasirinkta ir neviršija limito
        if (currentSelected.length < prev.stageSquares) {
          return {
            ...prev,
            selectedSeats: [...currentSelected, seatId]
          };
        } else {
          // Rodyti perspėjimą, jei viršytas limitas
          alert(`Maksimaliai galima pasirinkti ${prev.stageSquares} vietų`);
          return prev;
        }
      }
    });
  };

  // SeatGrid komponentas
  const SeatGrid = ({ cinema, maxSeats, selectedSeats, onSeatClick }) => {
    if (!cinema) return null;
    
    const seatLayout = generateSeatLayout(cinema.capacity);
    
    return (
      <div className="seat-grid-container">
        <div className="cinema-screen">
          <div className="screen-label">EKRANAS</div>
        </div>
        
        <div className="seat-grid">
          {seatLayout.map(({ row, seats }) => (
            <div key={row} className="seat-row">
              <div className="row-label">{row}</div>
              
              <div className="seats-container">
                {seats.map(seatId => {
                  const isSelected = selectedSeats.includes(seatId);
                  const isDisabled = selectedSeats.length >= maxSeats && !isSelected;
                  
                  return (
                    <button
                      key={seatId}
                      type="button"
                      className={`seat ${isSelected ? 'selected' : 'available'} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => onSeatClick(seatId)}
                      disabled={isDisabled}
                      title={isSelected ? `Pasirinkta: ${seatId}` : `Pasirinkti: ${seatId}`}
                    >
                      {seatId.slice(1)} {/* Rodyti tik numerį */}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Laisva</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Pasirinkta</span>
          </div>
          <div className="legend-item">
            <div className="seat disabled"></div>
            <span>Nepasiekiama</span>
          </div>
        </div>
      </div>
    );
  };

  // Filtruoti kino teatrus pagal pasirinktą miestą ir paieškos terminą
  useEffect(() => {
    let filtered = cinemaDatabase;

    // Filtruoti pagal pasirinktą miestą
    if (formData.city) {
      filtered = filtered.filter(cinema => cinema.city === formData.city);
    }

    // Filtruoti pagal paieškos terminą
    if (formData.cinemaName) {
      filtered = filtered.filter(cinema =>
        cinema.name.toLowerCase().includes(formData.cinemaName.toLowerCase())
      );
    }

    setFilteredCinemas(filtered);
  }, [formData.city, formData.cinemaName]);

  // Stebėti pasirinkto kino teatro keitimus ir užtikrinti maksimalią talpą
  useEffect(() => {
    if (formData.cinemaName && formData.city) {
      const cinema = cinemaDatabase.find(c => c.name === formData.cinemaName);
      
      // Visada užtikrinti, kad būtų pasirinkta maksimali talpa, kai keičiasi kino teatras
      if (cinema && formData.stageSquares !== cinema.capacity) {
        setFormData(prev => ({
          ...prev,
          stageSquares: cinema.capacity
        }));
      }
    }
  }, [formData.cinemaName, formData.city]);

  // Tvarkyti miesto pasirinkimą - automatiškai išvalyti kino teatro pasirinkimą
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData(prev => ({
      ...prev,
      city: selectedCity,
      cinemaName: '', // Išvalyti kino teatrą, kai keičiasi miestas
      stageSquares: 50 // Atkurti į numatytąją reikšmę
    }));
    
    // Jei miestas pasirinktas, sukoncentruoti į kino teatro įvedimą geresniam UX
    if (selectedCity && cinemaInputRef.current) {
      setTimeout(() => cinemaInputRef.current.focus(), 100);
    }
  };

  // Tvarkyti kino teatro įvedimo keitimą ir klaviatūros navigaciją
  const handleCinemaInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, cinemaName: value }));
    setShowCinemaSuggestions(true);
  };

  // Tvarkyti klaviatūros navigaciją kino teatro pasiūlymuose
  const handleCinemaKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowCinemaSuggestions(false);
    }
    // Pridėti daugiau klaviatūros navigacijos, jei reikia
  };

  // Tvarkyti kino teatro pasirinkimą iš pasiūlymų
  const handleCinemaSelect = (cinema) => {
    // Automatiškai pasirinkti MAKSIMALIĄ kino teatro talpą
    const defaultSeats = cinema.capacity;
    
    // Naudoti setTimeout, kad užtikrinti tinkamą būsenos atnaujinimą
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        cinemaName: cinema.name,
        stageSquares: defaultSeats,
        selectedSeats: [] // Išvalyti pasirinktas vietas, kai keičiasi kino teatras
      }));
    }, 0);
    
    setShowCinemaSuggestions(false);
    
    // Pašalinti fokusą nuo įvedimo
    if (cinemaInputRef.current) {
      cinemaInputRef.current.blur();
    }
  };

  // Generuoti laikų variantus (kas valandą nuo 10:00 iki 23:00)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 10; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      times.push(timeString);
    }
    return times;
  };

  // Patikrinti, ar laikas praeityje (tik šiandienos atveju)
  const isTimeInPast = (time, selectedDate) => {
    if (!selectedDate || !time) return false;
    
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // Patikrinti tik jei pasirinkta šiandienos data
    if (selected.toDateString() === today.toDateString()) {
      const [hour] = time.split(':').map(Number);
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();
      
      // Jei dabartinė valanda didesnė arba lygi, tai praeityje
      if (hour < currentHour) return true;
      if (hour === currentHour && currentMinutes > 30) return true; // Pridėti 30 min. buferį
    }
    
    return false;
  };

  // Tvarkyti kitus formos keitimus
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Išvalyti pasirinktas vietas, jei keičiasi vietų talpa
    if (name === 'stageSquares') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        selectedSeats: [] // Išvalyti pasirinktas vietas, kai keičiasi talpa
      }));
    } else if (name === 'date') {
      // Išvalyti laiką, kai keičiasi data (nes gali keistis prieinami laikai)
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        time: '' // Išvalyti laiką, kad vartotojas pasirinktų iš naujo
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Tvarkyti formos pateikimą
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rasti pasirinktą kino teatrą papildomoms duomenims
    const selectedCinema = cinemaDatabase.find(
      cinema => cinema.name === formData.cinemaName
    );
    
    // Gauti pasirinktų vietų skaičių
    const selectedSeatCount = formData.selectedSeats ? formData.selectedSeats.length : 0;
    
    // Patikrinti vietų skaičių
    if (selectedSeatCount > formData.stageSquares) {
      alert(`Klaida: Pasirinkote ${selectedSeatCount} vietas, bet maksimaliai galima ${formData.stageSquares} vietų.`);
      return;
    }
    
    if (selectedSeatCount === 0) {
      alert('Prašome pasirinkti bent vieną sėdimą vietą.');
      return;
    }
    
    // Patikrinti datą ir laiką
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Nustatyti į dienos pradžią
    
    if (selectedDate < today) {
      alert('Negalima rezervuoti praeities datai. Pasirinkite ateities datą.');
      return;
    }
    
    // Patikrinti laiką, jei pasirinkta šiandienos data
    if (isTimeInPast(formData.time, formData.date)) {
      alert('Negalima rezervuoti praeities laikui. Pasirinkite vėlesnį laiką.');
      return;
    }
    
    const submissionData = {
      movieTitle: formData.movieTitle,
      cinemaName: formData.cinemaName,
      city: formData.city,
      date: formData.date, // Siųsti kaip yra - backend tvarkys laiko juostą
      bookingTime: formData.time,
      stageSquares: Math.min(formData.stageSquares, 500), // Riboti backend limite
      seatNumber: selectedSeatCount,
      selectedSeats: formData.selectedSeats || [],
      price: selectedSeatCount * 10, // 10€ už vietą
      
      // Papildomi laukai formos suderinamumui
      selectedSeatsList: formData.selectedSeats || [],
      actualSeatCount: selectedSeatCount,
      cinemaCapacity: selectedCinema?.capacity || null,
      cinemaId: selectedCinema?.id || null
    };
    
    // Patikrinti, ar pateikta onBookingCreated arba onSubmit funkcija
    const submitHandler = onBookingCreated || onSubmit;
    
    if (typeof submitHandler === 'function') {
      try {
        await submitHandler(submissionData);
        
        // Rodyti sėkmės pranešimą tik jei nėra pasirinktinio tvarkytojo
        if (!onBookingCreated && !onSubmit) {
          alert(`Rezervacija sėkmingai sukurta!\n\nKino teatras: ${formData.cinemaName}\nFilmas: ${formData.movieTitle}\nData: ${formData.date}\nLaikas: ${formData.time}\nPasirinktos vietos: ${formData.selectedSeats.join(', ')}\nViso vietų: ${selectedSeatCount}`);
        }
        
        // Uždaryti formą, jei pateikta onClose
        if (typeof onClose === 'function') {
          onClose();
        }
        
      } catch (error) {
        console.error('Error in submission function:', error);
        alert('Įvyko klaida pateikiant formą. Patikrinkite duomenis ir bandykite dar kartą.');
      }
    } else {
      // Numatytasis elgesys, jei nėra pateikimo tvarkytojo
      console.log('Reservation Data:', submissionData);
      alert(`Rezervacija sėkmingai sukurta!\n\nKino teatras: ${formData.cinemaName}\nFilmas: ${formData.movieTitle}\nData: ${formData.date}\nLaikas: ${formData.time}\nPasirinktos vietos: ${formData.selectedSeats.join(', ')}\nViso vietų: ${selectedSeatCount}`);
    }
  };

  // Uždaryti pasiūlymus paspaudus už jų ribų
  useEffect(() => {
    const handleClickOutside = (event) => {
      const cinemaContainer = document.querySelector('.cinema-search-container');
      if (cinemaContainer && !cinemaContainer.contains(event.target)) {
        setShowCinemaSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gauti dabartinio kino teatro talpą vietų variantams
  const selectedCinema = cinemaDatabase.find(
    cinema => cinema.name === formData.cinemaName
  );
  
  const seatOptions = selectedCinema ? generateSeatOptions(selectedCinema.capacity) : [50, 100, 200, 300];
  
  // Gauti dabartinį vietų skaičių patikrinimui
  const currentSeatCount = formData.selectedSeats ? formData.selectedSeats.length : 0;

  return (
    <div className="enhanced-booking-form">
      <h2>Kino Bilietų Rezervacija</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        {/* Filmo pavadinimas */}
        <div className="form-group">
          <label htmlFor="movieTitle">Filmo pavadinimas:</label>
          <input
            type="text"
            id="movieTitle"
            name="movieTitle"
            value={formData.movieTitle}
            onChange={handleChange}
            required
            placeholder="Įveskite filmo pavadinimą..."
          />
        </div>

        {/* Miesto filtras */}
        <div className="form-group">
          <label htmlFor="cityFilter">Miestas (filtras):</label>
          <select 
            id="cityFilter" 
            value={formData.city} 
            onChange={handleCityChange}
            className="city-select"
          >
            <option value="">Visi miestai</option>
            <option value="Vilnius">Vilnius</option>
            <option value="Kaunas">Kaunas</option>
            <option value="Klaipėda">Klaipėda</option>
            <option value="Šiauliai">Šiauliai</option>
            <option value="Panevėžys">Panevėžys</option>
          </select>
        </div>

        {/* Kino teatro paieška su automatiškai baigiamu tekstu */}
        <div className="form-group cinema-search-container" style={{ position: 'relative' }}>
          <label htmlFor="cinemaName">Kino teatras:</label>
          <input
            type="text"
            id="cinemaName"
            name="cinemaName"
            value={formData.cinemaName}
            onChange={handleCinemaInputChange}
            onFocus={() => setShowCinemaSuggestions(true)}
            onKeyDown={handleCinemaKeyDown}
            ref={cinemaInputRef}
            required
            placeholder={formData.city ? 
              `Ieškokite kino teatro mieste ${formData.city}...` : 
              "Pirmiau pasirinkite miestą..."
            }
            autoComplete="off"
            disabled={!formData.city}
            className={!formData.city ? 'disabled-input' : ''}
          />

          {/* Kino teatro pasiūlymų išskleidžiamasis sąrašas */}
          {showCinemaSuggestions && filteredCinemas.length > 0 && (
            <div className="cinema-suggestions" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              {filteredCinemas.map(cinema => (
                <div
                  key={cinema.id}
                  className="cinema-suggestion-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCinemaSelect(cinema);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Apsaugoti nuo įvedimo blur
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div>
                    <div style={{ fontWeight: '500', color: '#333' }}>
                      {cinema.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {cinema.city}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#007bff',
                    fontWeight: '500'
                  }}>
                    {cinema.capacity} vietų
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pranešimas, kad nėra rezultatų */}
          {showCinemaSuggestions && formData.cinemaName && filteredCinemas.length === 0 && (
            <div className="no-results" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              padding: '16px',
              color: '#666',
              fontStyle: 'italic',
              zIndex: 1000
            }}>
              Kino teatrų nerasta pagal paieškos kriterijus
            </div>
          )}
        </div>

        {/* Kino teatro informacijos rodymas */}
        {selectedCinema && (
          <div className="cinema-info" style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '16px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{selectedCinema.name}</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {selectedCinema.city}
                </div>
              </div>
              <div style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Maksimaliai: {selectedCinema.capacity} vietų
              </div>
            </div>
          </div>
        )}

        {/* Data */}
        <div className="form-group">
          <label htmlFor="date">Data:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // Apsaugoti nuo praeities datų
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Galite pasirinkti tik ateities datas
          </div>
        </div>

        {/* Laikas */}
        <div className="form-group">
          <label htmlFor="time">Seansų laikas:</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={!formData.date ? 'disabled-input' : ''}
            disabled={!formData.date}
          >
            <option value="">Pasirinkite seansą</option>
            {generateTimeOptions().map(time => {
              const isPastTime = isTimeInPast(time, formData.date);
              return (
                <option 
                  key={time} 
                  value={time}
                  disabled={isPastTime}
                  style={{ color: isPastTime ? '#ccc' : 'inherit' }}
                >
                  {time} {isPastTime ? '(praeityje)' : ''}
                </option>
              );
            })}
          </select>
          {!formData.date && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>  
              Pirmiau pasirinkite datą
            </div>
          )}
        </div>

        {/* Dinamiškas vietų pasirinkimas */}
        <div className="form-group">
          <label htmlFor="stageSquares">Vietų skaičius:</label>
          <select
            id="stageSquares"
            name="stageSquares"
            value={formData.stageSquares}
            onChange={handleChange}
            required
            disabled={!selectedCinema}
            className={!selectedCinema ? 'disabled-input' : ''}
          >
            {seatOptions.map(option => (
              <option key={option} value={option}>
                {option} vietų
                {selectedCinema && option === selectedCinema.capacity ? ' (maksimali talpa - automatiškai parinkta)' : ''}
              </option>
            ))}
          </select>
          {!selectedCinema && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Pasirinkite kino teatrą, kad būtų rodomos galimos vietų opcijos
            </div>
          )}
          {selectedCinema && (
            <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>
              ✓ Automatiškai parinkta: {formData.stageSquares} vietų (maksimali kino teatro talpa)
            </div>
          )}
        </div>

        {/* Interaktyvus vietų pasirinkimo tinklelis */}
        <div className="form-group">
          <label>Prašome pasirinkti laisvą (-as) sėdimas vietas:</label>
          
          {selectedCinema ? (
            <>
              <SeatGrid 
                cinema={selectedCinema}
                maxSeats={formData.stageSquares}
                selectedSeats={formData.selectedSeats || []}
                onSeatClick={handleSeatClick}
              />
              
              <div style={{ fontSize: '12px', marginTop: '12px' }}>
                <div style={{ 
                  color: currentSeatCount > formData.stageSquares ? '#dc3545' : '#28a745',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {currentSeatCount > 0 ? (
                    <>
                      ✓ Pasirinktos vietos: {currentSeatCount} iš {formData.stageSquares}
                      {currentSeatCount > formData.stageSquares && (
                        <span style={{ color: '#dc3545', marginLeft: '8px' }}>
                          (Viršytas limitas!)
                        </span>
                      )}
                    </>
                  ) : (
                    <span style={{ color: '#666' }}>Paspauskite ant vietų, kad jas pasirinktumėte...</span>
                  )}
                </div>
                
                {currentSeatCount > 0 && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '12px', 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    <strong>Jūsų pasirinktos vietos:</strong><br />
                    <div style={{ 
                      marginTop: '6px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      lineHeight: '1.4'
                    }}>
                      {formData.selectedSeats.sort().join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ 
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #dee2e6',
              color: '#666'
            }}>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                🎬 Pasirinkite kino teatrą
              </div>
              <div style={{ fontSize: '14px' }}>
                Sėdimų vietų planas bus parodytas po kino teatro pasirinkimo
              </div>
            </div>
          )}
        </div>

        {/* Pateikimo mygtukas */}
        <div className="form-group">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={
              !formData.city || 
              !formData.cinemaName || 
              !selectedCinema || 
              currentSeatCount === 0 || 
              currentSeatCount > formData.stageSquares
            }
          >
            Rezervuoti Bilietus
          </button>
          {(!formData.city || !selectedCinema || currentSeatCount === 0 || currentSeatCount > formData.stageSquares) && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
              {!formData.city ? 'Pasirinkite miestą ir kino teatrą' : 
               !selectedCinema ? 'Pasirinkite kino teatrą iš pasiūlymų sąrašo' :
               currentSeatCount === 0 ? 'Pasirinkite sėdimas vietas' :
               currentSeatCount > formData.stageSquares ? `Sumažinkite vietų skaičių (maksimum: ${formData.stageSquares})` : ''}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedBookingForm;
