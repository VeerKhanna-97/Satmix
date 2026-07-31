export function initCalculator() {
  // ==========================================
  // 2. INVESTMENT CALCULATOR
  // ==========================================
  const calcRange = document.getElementById('calc-range');
  const calcAmountVal = document.getElementById('calc-amount-val');
  const stratLowBtn = document.getElementById('calc-strat-low');
  const stratMedBtn = document.getElementById('calc-strat-med');
  const stratHighBtn = document.getElementById('calc-strat-high');
  
  const resultTotalVal = document.getElementById('result-total');
  const resultInvestedVal = document.getElementById('result-invested');
  const resultGainVal = document.getElementById('result-gain');
  
  let dailySavings = 10;
  let selectedStrategy = 'low'; // 'low', 'med', or 'high'
  
  const strategyRates = {
    low: 0.08,  // 8% annual yield for stablecoins
    med: 0.16,  // 16% Balanced Growth yield
    high: 0.26  // 26% annual yield average for top assets index
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateReturns() {
    const annualRate = strategyRates[selectedStrategy];
    const dailyRate = annualRate / 365;
    const days = 365; // 1 year simulation
    
    let totalInvested = 0;
    let accumulatedValue = 0;
    
    // Simulate day-by-day auto-savings and compound growth
    for (let day = 0; day < days; day++) {
      totalInvested += dailySavings;
      accumulatedValue += dailySavings;
      accumulatedValue *= (1 + dailyRate);
    }
    
    const totalGains = accumulatedValue - totalInvested;
    
    // Animate the values counting up smoothly
    animateValue(resultTotalVal, parseInt(resultTotalVal.dataset.value || 0), Math.round(accumulatedValue), '₹');
    animateValue(resultInvestedVal, parseInt(resultInvestedVal.dataset.value || 0), totalInvested, '₹');
    animateValue(resultGainVal, parseInt(resultGainVal.dataset.value || 0), Math.round(totalGains), '₹');
    
    resultTotalVal.dataset.value = Math.round(accumulatedValue);
    resultInvestedVal.dataset.value = totalInvested;
    resultGainVal.dataset.value = Math.round(totalGains);
  }

  // Smooth number counting animation
  function animateValue(element, start, end, prefix = '') {
    if (start === end) {
      element.textContent = `${prefix}${formatCurrency(end)}`;
      return;
    }
    
    const duration = 400; // ms
    const startTime = performance.now();
    
    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = `${prefix}${formatCurrency(current)}`;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = `${prefix}${formatCurrency(end)}`;
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  function updateSavingsGoals() {
    const dailyInput = dailySavings;
    const annualRate = strategyRates[selectedStrategy];

    // Helper to calculate days to reach target using compound interest
    function calculateDaysToTarget(target, daily, rate) {
      if (rate === 0) return target / daily;
      const dailyRate = rate / 365;
      const val = (target * dailyRate) / (daily * (1 + dailyRate));
      return Math.log(1 + val) / Math.log(1 + dailyRate);
    }

    // 1. Emergency Shield (Target ₹15,000)
    const emEtaElement = document.getElementById('goal-em-eta');
    if (emEtaElement) {
      const emergencyDays = Math.round(calculateDaysToTarget(15000, dailyInput, annualRate));
      emEtaElement.innerHTML = `Time to complete: <span>${emergencyDays} days</span>`;
    }
    
    // 2. Gadget Upgrade (Target ₹60,000)
    const gaEtaElement = document.getElementById('goal-ga-eta');
    if (gaEtaElement) {
      const gadgetDays = Math.round(calculateDaysToTarget(60000, dailyInput, annualRate));
      const totalMonths = Math.round(gadgetDays / 30);
      let gadgetStr = '';
      if (totalMonths < 12) {
        gadgetStr = `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        gadgetStr = `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0) {
          gadgetStr += ` & ${months} month${months !== 1 ? 's' : ''}`;
        }
      }
      gaEtaElement.innerHTML = `Time to complete: <span>${gadgetStr}</span>`;
    }
    
    // 3. Wealth Accelerator (Target ₹2,50,000)
    const weEtaElement = document.getElementById('goal-we-eta');
    if (weEtaElement) {
      const wealthDays = Math.round(calculateDaysToTarget(250000, dailyInput, annualRate));
      const totalMonths = Math.round(wealthDays / 30);
      let wealthStr = '';
      if (totalMonths < 12) {
        wealthStr = `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        wealthStr = `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0) {
          wealthStr += ` & ${months} month${months !== 1 ? 's' : ''}`;
        }
      }
      weEtaElement.innerHTML = `Time to complete: <span>${wealthStr}</span>`;
    }
  }

  if (calcRange) {
    calcRange.addEventListener('input', (e) => {
      dailySavings = parseInt(e.target.value, 10);
      calcAmountVal.textContent = `₹${dailySavings}`;
      calculateReturns();
    });
  }

  if (stratLowBtn && stratMedBtn && stratHighBtn) {
    function updateSlider(val) {
      dailySavings = val;
      if (calcRange) calcRange.value = val;
      if (calcAmountVal) calcAmountVal.textContent = `₹${val}`;
    }

    stratLowBtn.addEventListener('click', () => {
      selectedStrategy = 'low';
      updateSlider(10);
      stratLowBtn.classList.add('active');
      stratMedBtn.classList.remove('active');
      stratHighBtn.classList.remove('active');
      calculateReturns();
    });

    stratMedBtn.addEventListener('click', () => {
      selectedStrategy = 'med';
      updateSlider(30);
      stratMedBtn.classList.add('active');
      stratLowBtn.classList.remove('active');
      stratHighBtn.classList.remove('active');
      calculateReturns();
    });

    stratHighBtn.addEventListener('click', () => {
      selectedStrategy = 'high';
      updateSlider(50);
      stratHighBtn.classList.add('active');
      stratLowBtn.classList.remove('active');
      stratMedBtn.classList.remove('active');
      calculateReturns();
    });
  }

  // Wrap calculation run to also update goals
  const originalCalculateReturns = calculateReturns;
  calculateReturns = function() {
    originalCalculateReturns();
    updateSavingsGoals();
  };

  // Initial calculation run
  if (calcRange) {
    calculateReturns();
  }

}
