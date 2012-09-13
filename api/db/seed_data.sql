insert into users (username, password, salt, email) 
    values
    ('carbontax', sha('foobarberkshirehathaway'), 'berkshirehathaway', 'carbontax@gmail.com'),
    ('googalan', sha('foobarberkshirehathaway'), 'berkshirehathaway', 'googalan@gmail.com');

insert into security (symbol, name, dividend, dividend_label, price, outstanding, description)
    values
    ('GRO', "Growth Corporation of America", 1, 'Dividend', 100, 600, ""),
    ('MET', "Metro Properties, Inc.", 0, 'Dividend', 100, 600, ""),
    ('PIO', "Pioneer Mutual Fund", 4, 'Dividend', 100, 600, ""),
    ('SHB', "Shady Brooks Development", 7, 'Dividend', 100, 600, ""),
    ('STK', "Stryker Drilling Company", 0, 'Dividend', 100, 600, ""),
    ('TCT', "Tri-City Transport Company", 0, 'Dividend', 100, 600, ""),
    ('UAC', "United Auto Company", 2, 'Dividend', 100, 600, ""),
    ('URE', "Uranium Enterprises, Inc.", 6, 'Dividend', 100, 600, ""),
    ('VAL', "Vally Power & Light Company", 3, 'Dividend', 100, 600, ""),
    ('BND', "Central City Municipal Bonds", 5, 'Dividend', 1, 60000, "");

# GRO
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 12 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, 7 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 9 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 7 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 8 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 6 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 5 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, -2 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, 11 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, -5 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -8 from security s where s.symbol="GRO";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -2 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 26 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 18 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 23 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 20 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 17 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 19 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 11 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 13 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, 14 from security s where s.symbol="GRO";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 24 from security s where s.symbol="GRO";

# MET
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 14 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, -6 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 10 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 8 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 6 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 4 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 7 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, 6 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, 11 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, 13 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -10 from security s where s.symbol="MET";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -10 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 16 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 23 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 28 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 15 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 21 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 24 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 18 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 31 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, -8 from security s where s.symbol="MET";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 24 from security s where s.symbol="MET";

# PIO
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 13 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, 10 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 7 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 5 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 4 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 3 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, -1 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, -3 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, -5 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, -8 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -10 from security s where s.symbol="PIO";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -7 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 25 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 11 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, -2 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 15 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 13 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 17 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 14 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 1 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, 19 from security s where s.symbol="PIO";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 23 from security s where s.symbol="PIO";

# SHB
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 10 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, -10 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, -5 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, -6 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, -4 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 3 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, -3 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, -8 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, -7 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, 6 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -15 from security s where s.symbol="SHB";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -9 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 8 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 12 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 11 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 7 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, -2 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 9 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 22 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 24 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, -1 from security s where s.symbol="SHB";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 20 from security s where s.symbol="SHB";

# STK
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 10 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, 30 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, -20 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, -40 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 40 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, -15 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 45 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, -20 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, 30 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, 25 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -20 from security s where s.symbol="STK";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -2 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, -14 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 46 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 56 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, -20 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 37 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, -5 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 67 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, -11 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, -9 from security s where s.symbol="STK";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 51 from security s where s.symbol="STK";

# TCT
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 20 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, 6 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 12 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 3 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 8 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 5 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 6 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, 7 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, 10 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, 4 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -20 from security s where s.symbol="TCT";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -9 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 21 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 18 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 19 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 15 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 23 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 26 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 15 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 18 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, 25 from security s where s.symbol="TCT";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 27 from security s where s.symbol="TCT";

# UAC
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 21 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, -19 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 21 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 16 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 4 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 8 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, -10 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, 10 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, -11 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, 18 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -23 from security s where s.symbol="UAC";
# BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -7 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 14 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, -5 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 30 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 13 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 23 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 13 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 22 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 18 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, -10 from security s where s.symbol="UAC";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 38 from security s where s.symbol="UAC";

# URE
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 25 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, 22 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 18 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, -14 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, -12 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, -8 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 10 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, 14 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, -18 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, -22 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -25 from security s where s.symbol="URE";
#BULL
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -16 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, -4 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 34 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 29 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, -10 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 19 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, -7 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 18 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, -14 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, 13 from security s where s.symbol="URE";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 33 from security s where s.symbol="URE";

# VAL
# BEAR
insert into security_delta (security_id, roll, market, delta) select s.id, 2, 0, 8 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 0, -2 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 0, 7 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 0, 4 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 0, 3 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 0, 5 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 0, 4 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 0, 6 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 0, -4 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 0, -4 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 0, -7 from security s where s.symbol="VAL";

insert into security_delta (security_id, roll, market, delta) select s.id, 2, 1, -4 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 3, 1, 17 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 4, 1, 15 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 5, 1, 14 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 6, 1, 12 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 7, 1, 14 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 8, 1, 15 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 9, 1, 13 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 10, 1, 10 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 11, 1, 19 from security s where s.symbol="VAL";
insert into security_delta (security_id, roll, market, delta) select s.id, 12, 1, 18 from security s where s.symbol="VAL";

