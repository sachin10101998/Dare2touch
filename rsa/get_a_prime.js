var bigInt = require('big-integer');

// function modexp(a, b, c){ // calculates (a^b) mod c
// 	if (b == 0) return 1;
// 	else if (b == 1) return (a + c) % c;
// 	else if (b % 2 == 0){
// 		return (modexp((a*a), Math.floor(b / 2), c) + c) % c;
// 	}
// 	else{
// 		return ((modexp((a*a), Math.floor(b / 2), c) * (a % c)) + c) % c;
// 	}
// }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function primeRepeatr(N, cntr){
	if (cntr == 1){
		return true;
	}
	else{
		var aaa = modexp(getRandomInt(2,N-1), N-1, N);
		if (aaa == 1){
			return primeRepeatr(N, cntr - 1);
		}
		else{
			return false;
		}
	}
}

function isPrime(N){
	var ll = 100;
	if (N > 1){
		if (N > ll){
			return primeRepeatr(N, ll);
		}
		else{
			return primeRepeatr(N, N-1);
		}
	}
	else return false;
}

function prime_mom(lo_lim){
	ulim = lo_lim * 100;
	var res = 0;
	var cnt = 1;
	while (true){
		var contestant = getRandomInt(lo_lim, ulim);
		if (isPrime(contestant)){
			res = contestant;
			break;
		}
		cnt++;
		if (cnt > 100){
			ulim *= 10;
		}
	}
	return res;
}

function prime_gen(){
	return prime_mom(Math.pow(10, 27));
}


if( 'undefined' != typeof global ) {
    module.exports = global.prime_gen = prime_gen;
}
