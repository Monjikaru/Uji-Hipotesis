function performTest() {
    const testType = document.getElementById("testType").value;
    let result = "";

    if (testType === "satu-sampel") {
        const data = prompt("Masukkan data sampel (pisahkan dengan koma):").split(',').map(Number);
        const nullHypothesisMean = parseFloat(prompt("Masukkan nilai rata-rata hipotesis nol (H0):"));
        const alpha = parseFloat(prompt("Masukkan tingkat signifikansi (alpha, cth: 0.05):"));
        const tailType = prompt("Pilih jenis ekor uji (dua-ekor, ekor-kanan, ekor-kiri):").toLowerCase();

        // Logika uji t satu sampel
        const tStatistic = (data.reduce((a, b) => a + b, 0) / data.length - nullHypothesisMean) / (Math.sqrt(data.reduce((a, b) => a + Math.pow(b - (data.reduce((a, b) => a + b, 0) / data.length), 2), 0) / (data.length - 1)) / Math.sqrt(data.length));
        const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), data.length - 1));

        result = `Statistik Uji t: ${tStatistic.toFixed(4)}<br>Nilai p (p-value): ${pValue.toFixed(4)}<br>`;

        // Keputusan
        if (tailType === "dua-ekor") {
            result += (pValue < alpha) ? "Tolak hipotesis nol (H0)." : "Gagal menolak hipotesis nol (H0).";
        }
        // Tambahkan logika untuk ekor-kanan dan ekor-kiri sesuai kebutuhan

    } else if (testType === "dua-sampel") {
        // Logika untuk dua sampel independen
    } else if (testType === "berpasangan") {
        // Logika untuk uji berpasangan
    } else {
        result = "Jenis uji tidak valid.";
    }

    document.getElementById("result").innerHTML = result;
}
