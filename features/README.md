Note features for accentuation analysis
=======================================

The data files in this directory are in the TSV (tab-separate-value) format, with the first
row giving the label for the column:

| column |  label       | meaning
|--------|--------------|--------
| 1      |  line        |  The line number of the note in original Humdrum file.
| 2      |  field       |  The column number of the note in original Humdrum file.
| 3      |  track       |  The track number of the note in the original Humdrum file (similar to field).
| 4      |  subtrack    |  The subtrack number of the note.  This is the voice/layer: 0=monophonic in staff; 1=polyphonic instaff and in top layer; 2,3=second, third, etc. layer.
| 5      |  group       |  This is the rhythmic group number (0=undefined group; 1=group A; 2=group B).
| 6      |  staff       |  This is the staff number (1 = bottom staff).
| 7      |  measure     |  The measure number the note attack occurs in.
| 8      |  qstart      |  The absolute quarter-note start time of the note.
| 9      |  tstart      |  The absolute tick start time of the note.
| 10     |  qdur        |  The quarter-note duration of the note.
| 11     |  tdur        |  The tick duration of the note.
| 12     |  pitch       |  The pitch of the note as a MIDI key number (60 = middle C).
| 13     |  chord       |  Is the note in a chord? 0=no, 1=yes.
| 14     |  accent      |  Does the note have a regular accent? 0=no, 1=yes.
| 15     |  marcato     |  Does the note have a strong accent? 0=no, 1=yes.
| 16     |  sforzando   |  Does the note have a sforzando? 0=no, 1=yes.
| 17     |  tenuto      |  Does the note have a tenuto? 0=no, 1=yes.
| 18     |  staccato    |  Does the note have a staccato? 0=no, 1=yes.
| 19     |  trill       |  Does the note have a trill? 0=no, 1=yes.
| 20     |  mordent     |  Does the note have a mordent? 0=no, 1=yes.
| 21     |  turn        |  Does the note have a turn? 0=no, 1=yes.
| 22     |  sslur       |  Does the note have a slur beginning? 0=no, 1=yes.
| 23     |  eslur       |  Does the note have a slur ending? 0=no, 1=yes.
| 24     |  ppitch      |  Previous MIDI key number (-1 = no previous note).
| 25     |  pqstart     |  Previous note absolute quarter-note start time (-1 = no previous note).
| 26     |  ptstart     |  Previous note absolute tick start time (-1 = no previous note).
| 27     |  pqdur       |  Previous note quarter-note duration (-1 = no previous note).
| 28     |  ptdur       |  Previous note tick duration (-1 = no previous note).
| 29     |  npitch      |  Next MIDI key number (-1 = no next note).
| 30     |  nqstart     |  Next note absolute quarter-note start time (-1 = no next note).
| 31     |  ntstart     |  Next note absolute tick start time (-1 = no next note).
| 32     |  nqdur       |  Next note quarter-note duration (-1 = no next note).
| 33     |  ntdur       |  Next note tick duration (-1 = no next note).


Each of the following rows repreent one note in the example with the extracted features for each column listed above.



