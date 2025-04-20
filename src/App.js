import React, { useState, useRef, useEffect } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaAt,
  FaGlobe,
  FaNetworkWired,
  FaFileExport,
  FaExternalLinkAlt,
} from 'react-icons/fa';

const cardBackgroundColor = '#222';
const borderColor = '#333';
const buttonBackgroundColor = '#555';
// Come back to hover styles, currently not working
//const buttonHoverBackgroundColor = '#777';
const borderRadius = '8px';
const boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';

const cardStyle = {
  backgroundColor: cardBackgroundColor,
  borderRadius,
  boxShadow,
  border: `1px solid ${borderColor}`,
};

const filterButtonStyle = {
  borderRadius: 5,
  border: `1px solid ${borderColor}`,
  backgroundColor: buttonBackgroundColor,
  color: 'white',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '0.9em',
  // transition: 'background-color 0.3s ease',
  // ':hover': {
  //   backgroundColor: buttonHoverBackgroundColor,
  // },
};

const cardButtonStyle = {
  ...cardStyle,
  backgroundColor: buttonBackgroundColor,
  border: 'none',
  borderRadius: '5px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '0.8em',
  marginLeft: '8px',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
};

const IdentifierCard = ({ identifier, setHighlightedRange }) => {
  let icon;
  switch (identifier.type) {
    case 'Email Address':
      icon = <FaEnvelope style={{ marginRight: '8px', color: '#64b5f6' }} />;
      break;
    case 'Phone Number':
      icon = <FaPhone style={{ marginRight: '8px', color: '#4caf50' }} />;
      break;
    case 'Location':
      icon = (
        <FaMapMarkerAlt style={{ marginRight: '8px', color: '#f44336' }} />
      );
      break;
    case 'Username':
      icon = <FaAt style={{ marginRight: '8px', color: '#ff9800' }} />;
      break;
    case 'Website':
      icon = <FaGlobe style={{ marginRight: '8px', color: '#9c27b0' }} />;
      break;
    case 'IP Address':
      icon = (
        <FaNetworkWired style={{ marginRight: '8px', color: '#00bcd4' }} />
      );
      break;
    default:
      icon = null;
  }

  const goToWebsite = () => {
    window.open(identifier.value, '_blank', 'noopener,noreferrer');
  };

  const goToLocation = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identifier.value)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div
      style={{
        ...cardStyle,
        padding: 15,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onMouseEnter={() => setHighlightedRange(identifier.indices)}
      onMouseLeave={() => setHighlightedRange(null)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <div>
          <h4
            style={{
              margin: '0 0 5px 0',
              borderBottom: `1px solid ${borderColor}`,
              paddingBottom: 5,
            }}
          >
            {identifier.type}
          </h4>
          <p style={{ margin: '0' }}>
            {identifier.value} ({identifier.count} times)
          </p>
        </div>
      </div>
      <div>
        {identifier.type === 'Website' && (
          <button onClick={goToWebsite} style={cardButtonStyle}>
            <FaExternalLinkAlt style={{ marginRight: '5px' }} /> Go to Website
          </button>
        )}
        {identifier.type === 'Location' && (
          <button onClick={goToLocation} style={cardButtonStyle}>
            <FaMapMarkerAlt style={{ marginRight: '5px' }} /> Open in Maps
          </button>
        )}
      </div>
    </div>
  );
};

const IdentifierList = ({
  identifiers,
  setHighlightedRange,
  onFilterChange,
  currentFilter,
}) => {
  const filteredIdentifiers = currentFilter
    ? identifiers.filter((id) => id.type === currentFilter)
    : identifiers;

  return (
    <div
      style={{
        ...cardStyle,
        width: '100%',
        padding: 15,
        maxHeight: 400,
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          borderBottom: `1px solid ${borderColor}`,
          paddingBottom: 5,
          marginBottom: 10,
        }}
      >
        Potential Identifiers
      </h2>
      <div style={{ marginBottom: '10px', display: 'flex', gap: 5 }}>
        <button onClick={() => onFilterChange('')} style={filterButtonStyle}>
          All
        </button>
        <button
          onClick={() => onFilterChange('Email Address')}
          style={filterButtonStyle}
        >
          Emails
        </button>
        <button
          onClick={() => onFilterChange('Phone Number')}
          style={filterButtonStyle}
        >
          Phones
        </button>
        <button
          onClick={() => onFilterChange('Location')}
          style={filterButtonStyle}
        >
          Locations
        </button>
        <button
          onClick={() => onFilterChange('Username')}
          style={filterButtonStyle}
        >
          Usernames
        </button>
        <button
          onClick={() => onFilterChange('Website')}
          style={filterButtonStyle}
        >
          Websites
        </button>
        <button
          onClick={() => onFilterChange('IP Address')}
          style={filterButtonStyle}
        >
          IPs
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredIdentifiers.length > 0 ? (
          filteredIdentifiers.map((identifier, index) => (
            <IdentifierCard
              key={`${identifier.type}-${identifier.value}-${index}`}
              identifier={identifier}
              setHighlightedRange={setHighlightedRange}
            />
          ))
        ) : (
          <p style={{ color: '#aaa' }}>
            No identifiers found for the selected filter.
          </p>
        )}
      </div>
    </div>
  );
};

const TextAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [identifiers, setIdentifiers] = useState([]);
  const [highlightedRange, setHighlightedRange] = useState(null);
  const [filter, setFilter] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && highlightedRange) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        highlightedRange.index,
        highlightedRange.index + highlightedRange.length,
      );
    } else if (textareaRef.current) {
      textareaRef.current.blur();
      textareaRef.current.setSelectionRange(0, 0);
    }
  }, [highlightedRange]);

  const handleTextChange = (event) => {
    setInputText(event.target.value);
  };

  const analyzeText = () => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    const locationRegex = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)*), ([A-Z][a-z]+)\b/g;
    const usernameRegex = /(?<!\S)@\w+\b/g;
    const websiteRegex =
      /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/\S*)?(?<!@\S*)/g;
    const ipAddressRegex =
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;

    const foundIdentifiers = [];
    const identifierCounts = {};
    const regexes = {
      'Email Address': emailRegex,
      'Phone Number': phoneRegex,
      Location: locationRegex,
      Username: usernameRegex,
      Website: websiteRegex,
      'IP Address': ipAddressRegex,
    };

    for (const type in regexes) {
      const regex = regexes[type];
      let match;
      while ((match = regex.exec(inputText)) !== null) {
        const value = match[0];
        const identifier = {
          type: type,
          value: value,
          indices: { index: match.index, length: match[0].length },
        };
        foundIdentifiers.push(identifier);
        const key = `${type}-${value}`;
        identifierCounts[key] = (identifierCounts[key] || 0) + 1;
      }
      regex.lastIndex = 0;
    }

    const uniqueIdentifiersWithCount = Array.from(
      foundIdentifiers
        .reduce((map, id) => {
          const key = `${id.type}-${id.value}`;
          if (!map.has(key)) {
            map.set(key, { ...id, count: identifierCounts[key] });
          }
          return map;
        }, new Map())
        .values(),
    );

    setIdentifiers(uniqueIdentifiersWithCount);
    setFilter('');
    setHighlightedRange(null);
  };

  const copyToClipboard = () => {
    const filteredText = (
      filter ? identifiers.filter((id) => id.type === filter) : identifiers
    )
      .map((id) => `${id.type},${id.value},${id.count}`)
      .join('\n');
    navigator.clipboard.writeText(filteredText);
    alert(
      `Copied ${filter || 'All'} identifiers to clipboard (CSV format in clipboard)!`,
    );
  };

  const exportToCSV = () => {
    const filteredIdentifiers = filter
      ? identifiers.filter((id) => id.type === filter)
      : identifiers;

    if (filteredIdentifiers.length === 0) {
      alert('No identifiers to export for the current filter.');
      return;
    }

    const csvRows = [];
    const header = 'Type,Value,Count';
    csvRows.push(header);

    filteredIdentifiers.forEach((identifier) => {
      csvRows.push(
        `${identifier.type},${identifier.value},${identifier.count}`,
      );
    });

    const csvData = csvRows.join('\n');
    const filename = `identifiers${filter ? `_${filter.replace(/\s+/g, '_')}` : ''}.csv`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <header
        style={{
          backgroundColor: 'black',
          padding: 20,
          textAlign: 'center',
        }}
      >
        <h1>🔍 Identifier Discovery</h1>
        <p>Find what matters.</p>
      </header>
      <div style={{ display: 'flex', gap: 20 }}>
        <textarea
          ref={textareaRef}
          style={{
            ...cardStyle,
            width: '100%',
            height: 400,
            padding: 15,
            color: 'white',
          }}
          placeholder="Paste your text here..."
          value={inputText}
          onChange={handleTextChange}
        />
        <IdentifierList
          identifiers={identifiers}
          setHighlightedRange={setHighlightedRange}
          onFilterChange={setFilter}
          currentFilter={filter}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={analyzeText} style={cardButtonStyle}>
          Analyze Text
        </button>
        <button onClick={copyToClipboard} style={cardButtonStyle}>
          Copy {filter || 'All'} (Clipboard CSV)
        </button>
        <button onClick={exportToCSV} style={cardButtonStyle}>
          <FaFileExport style={{ marginRight: '5px' }} /> Export{' '}
          {filter || 'All'} (CSV)
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div
      style={{
        backgroundColor: '#181818',
        color: '#eee',
        minHeight: '100vh',
      }}
    >
      <AppContent />
    </div>
  );
}

const AppContent = () => <TextAnalyzer />;

export default App;
