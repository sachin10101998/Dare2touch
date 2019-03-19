
function modexp(a, b, c){ // calculates (a^b) mod c
	if (b == 0) return 1;
	else if (b == 1) return (a + c) % c;
	else if (b % 2 == 0){
		return (modexp((a*a), Math.floor(b / 2), c) + c) % c;
	}
	else{
		return ((modexp((a*a), Math.floor(b / 2), c) * (a % c)) + c) % c;
	}
}

