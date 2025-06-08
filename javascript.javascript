function showInputFields() {
    const testType = document.getElementById("testType").value;
    const inputFields = document.getElementById("inputFields");
    inputFields.innerHTML = ""; // Clear previous input fields

    if (testType === "satu-sampel") {
        inputFields.innerHTML = `
            <label>Masukkan data sampel (pisahkan dengan koma):</label>
            <input type="text" id="data" placeholder="Contoh: 1,2,3,4,5">
            <label>Masukkan nilai rata-rata hipotesis nol (H0):</label>
            <input type="number" id="nullHypothesisMean" placeholder="Contoh: 3">
            <label>Masukkan tingkat signifikansi (alpha, cth: 0.05):</label>
            <input type="number" step="0.01" id="alpha" placeholder="Contoh: 0.05">
            <label>Pilih jenis ekor uji:</label>
            <select id="tailType">
                <option value="dua-ekor">Dua Ekor</option>
                <option value="ekor-kanan">Ekor Kanan</option>
                <option value="ekor-kiri">Ekor Kiri</option>
            </select>
        `;
    } else if (testType === "dua-sampel") {
        inputFields.innerHTML = `
            <label>Masukkan data sampel 1 (pisahkan dengan koma):</label>
            <input type="text" id="data1" placeholder="Contoh: 1,2,3,4,5">
            <label>Masukkan data sampel 2 (pisahkan dengan koma):</label>
            <input type="text" id="data2" placeholder="Contoh: 2,3,4,5,6">
            <label>Masukkan tingkat signifikansi (alpha, cth: 0.05):</label>
            <input type="number" step="0.01" id="alpha2" placeholder="Contoh: 0.05">
            <label>Asumsikan variansi sama?</label>
            <select id="equalVar">
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
            </select>
            <label>Pilih jenis ekor uji:</label>
            <select id="tailType2">
                <option value="dua-ekor">Dua Ekor</option>
                <option value="ekor-kanan">Ekor Kanan</option>
                <option value="ekor-kiri">Ekor Kiri</option>
            </select>
        `;
    } else if (testType === "berpasangan") {
        inputFields.innerHTML = `
            <label>Masukkan data sampel 1 (sebelum - pisahkan dengan koma):</label>
            <input type="text" id="data1" placeholder="Contoh: 1,2,3,4,5">
            <label>Masukkan data sampel 2 (setelah - pisahkan dengan koma):</label>
            <input type="text" id="data2" placeholder="Contoh: 2,3,4,5,6">
            <label>Masukkan tingkat signifikansi (alpha, cth: 0.05):</label>
            <input type="number" step="0.01" id="alpha3" placeholder="Contoh: 0.05">
            <label>Pilih jenis ekor uji:</label>
            <select id="tailType3">
                <option value="dua-ekor">Dua Ekor</option>
                <option value="ekor-kanan">Ekor Kanan</option>
                <option value="ekor-kiri">Ekor Kiri</option>
            </select>
        `;
    }
}

function performTest() {
    const testType = document.getElementById("testType").value;
    let result = "";

    if (testType === "satu-sampel") {
        const data = document.getElementById("data").value.split(',').map(Number);
        const nullHypothesisMean = parseFloat(document.getElementById("nullHypothesisMean").value);
        const alpha = parseFloat(document.getElementById("alpha").value);
        const tailType = document.getElementById("tailType").value;

        // Logika uji t satu sampel
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (data.length - 1);
        const tStatistic = (mean - nullHypothesisMean) / Math.sqrt(variance / data.length);
        const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), data.length - 1));

        result = `Statistik Uji t: ${tStatistic.toFixed(4)}<br>Nilai p (p-value): ${pValue.toFixed(4)}<br>`;

        // Keputusan
        if (tailType === "dua-ekor") {
            result += (pValue < alpha) ? "Tolak hipotesis nol (H0)." : "Gagal menolak hipotesis nol (H0).";
        } else if (tailType === "ekor-kanan") {
            if (pValue / 2 < alpha && tStatistic > 0) {
                result += "Tolak hipotesis nol (H0).";
            } else {
                result += "Gagal menolak hipotesis nol (H0).";
            }
        } else if (tailType === "ekor-kiri") {
            if (pValue / 2 < alpha && tStatistic < 0) {
                result += "Tolak hipotesis nol (H0).";
            } else {
                result += "Gagal menolak hipotesis nol (H0).";
            }
        }

    } else if (testType === "dua-sampel") {
        const data1 = document.getElementById("data1").value.split(',').map(Number);
        const data2 = document.getElementById("data2").value.split(',').map(Number);
        const alpha = parseFloat(document.getElementById("alpha2").value);
        const equalVar = document.getElementById("equalVar").value === "ya";
        const tailType = document.getElementById("tailType2").value;

        // Logika uji t dua sampel independen
        const mean1 = data1.reduce((a, b) => a + b, 0) / data1.length;
        const mean2 = data2.reduce((a, b) => a + b, 0) / data2.length;
        const variance1 = data1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / (data1.length - 1);
        const variance2 = data2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / (data2.length - 1);
        const tStatistic = (mean1 - mean2) / Math.sqrt((equalVar ? variance1 + variance2 : (variance1 / data1.length) + (variance2 / data2.length)));
        const pValue = jStat.ttest(tStatistic, data1.length + data2.length - 2, equalVar);

        result = `Statistik Uji t: ${tStatistic.toFixed(4)}<br>Nilai p (p-value): ${pValue.toFixed(4)}<br>`;

        // Keputusan
        if (tailType === "dua-ekor") {
            result += (pValue < alpha) ? "Tolak hipotesis nol (H0)." : "Gagal menolak hipotesis nol (H0).";
        } else if (tailType === "ekor-kanan") {
            if (pValue / 2 < alpha && tStatistic > 0) {
                result += "Tolak hipotesis nol (H0).";
            } else {
                result += "Gagal menolak hipotesis nol (H0).";
            }
        } else if (tailType === "ekor-kiri") {
            if (pValue / 2 < alpha && tStatistic < 0) {
                result += "Tolak hipotesis nol (H0).";
            } else {
                result += "Gagal menolak hipotesis nol (H0).";
            }
        }

    } else if (testType === "berpasangan") {
        const data1 = document.getElementById("data1").value.split(',').map(Number);
        const data2 = document.getElementById("data2").value.split(',').map(Number);
        const alpha = parseFloat(document.getElementById("alpha3").value);
        const tailType = document.getElementById("tailType3").value;

        if (data1.length !== data2.length) {
            result = "Error: Jumlah data pada kedua sampel harus sama untuk uji berpasangan.";
        } else {
            const differences = data1.map((value, index) => value - data2[index]);
            const meanDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
            const varianceDiff = differences.reduce((a, b) => a + Math.pow(b - meanDiff, 2), 0) / (differences.length - 1);
            const tStatistic = meanDiff / Math.sqrt(varianceDiff / differences.length);
            const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatistic), differences.length - 1));

            result = `Statistik Uji t: ${tStatistic.toFixed(4)}<br>Nilai p (p-value): ${pValue.toFixed(4)}<br>`;

            // Keputusan
            if (tailType === "dua-ekor") {
                result += (pValue < alpha) ? "Tolak hipotesis nol (H0)." : "Gagal menolak hipotesis nol (H0).";
            } else if (tailType === "ekor-kanan") {
                if (pValue / 2 < alpha && tStatistic > 0) {
                    result += "Tolak hipotesis nol (H0).";
                } else {
                    result += "Gagal menolak hipotesis nol (H0).";
                }
            } else if (tailType === "ekor-kiri") {
                if (pValue / 2 < alpha && tStatistic < 0) {
                    result += "Tolak hipotesis nol (H0).";
                } else {
                    result += "Gagal menolak hipotesis nol (H0).";
                }
            }
        }
    } else {
        result = "Jenis uji tidak valid.";
    }

    document.getElementById("result").innerHTML = result;
}
