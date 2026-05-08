const SongSchema = {
  required: ['id', 'title', 'lyrics'],
  defaults: {
    type: 'song', // default type
    style: { fontSize: '80px', fontColor: '#ffffff', textAlign: 'center' },
    background: null // null means use default background
  }
};

function validateItem(data) {
  const errors = [];
  if (data.id === undefined || data.id === null) errors.push('Missing id');
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) errors.push('Missing title');
  if (typeof data.lyrics !== 'string') errors.push('Missing lyrics');
  return { valid: errors.length === 0, errors };
}

function migrateItem(data) {
  const migrated = { ...SongSchema.defaults, ...data };

  if (migrated.style) {
    migrated.style = { ...SongSchema.defaults.style, ...migrated.style };

    // Normalize legacy field: fontColor → color
    if (migrated.style.fontColor && !migrated.style.color) {
      migrated.style.color = migrated.style.fontColor;
    }
    delete migrated.style.fontColor;

    // Normalize fontSize: plain number → 'px', legacy 'pt' → 'px'
    if (typeof migrated.style.fontSize === 'number') {
      migrated.style.fontSize = migrated.style.fontSize + 'px';
    } else if (typeof migrated.style.fontSize === 'string' && migrated.style.fontSize.endsWith('pt')) {
      migrated.style.fontSize = Math.round(parseFloat(migrated.style.fontSize) * 2 / 3) + 'px';
    }
  }

  return migrated;
}

module.exports = { validateItem, migrateItem, SongSchema };
