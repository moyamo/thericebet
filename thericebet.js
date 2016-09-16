function main() {
    var number = document.getElementById('number');
    var daysSinceElem = document.getElementById('daysSince');
    var today = new Date();
    var dayZero = new Date(2016, 07, 5, 21, 00); // I think it happened at about 9 o clock
    var oneDay = 1000 * 60 * 60 * 24;
    var daysSince = ((today.getTime() - dayZero.getTime()) / oneDay)| 0;
    daysSinceElem.appendChild(document.createTextNode(daysSince));
    number.appendChild(document.createTextNode(pow2(daysSince)));
};

function pow2(n) {
    var a = BigNum(1);
    for (var i = 0; i < n; ++i) {
        a.add(a.copy());
    }
    return a;
}

// It's 15 so that two of them will fit in an int32 (easier for division)
var BigNumBits = 15;            // Number of bits in a big num

function BigNum (n) {
    /*A little endian positive big num*/
    var mask = (1 << BigNumBits) - 1;
    var that = {
        digits: [n || 0],
        add: function (n) {
            var carry = 0;
            for (var i = 0; i < n.digits.length; ++i) {
                if (i >= that.digits.length) {
                    that.digits.push(0);
                }
                that.digits[i] += n.digits[i] + carry;
                if (that.digits[i] > mask) {
                    carry = 1;
                } else {
                    carry = 0;
                }
                that.digits[i] &= mask;
            }
            if (carry == 1) {
                that.digits.push(1);
            }
        },
        divSmall: function(n) {
            var result = BigNum();
            result.digits = [];
            n = n | 0; // force n to be an int32
            var broughtDown = 0;
            for (var i = that.digits.length - 1; i >= 0; i--) {
                var dividend = (broughtDown << BigNumBits) + that.digits[i];
                var rem = dividend % n;
                var quotient = (dividend / n) | 0;
                result.digits.push(quotient);
                broughtDown = rem;
            }
            result.digits.reverse();
            return {quot: result, rem: broughtDown};
        },
        copy: function (n) {
            var n = BigNum(0);
            n.add(that);
            return n;
        },
        isZero: function (n) {
            for (var i = 0; i < that.digits.length; ++i) {
                if (that.digits[i] != 0) return false;
            }
            return true;
        },
        
        toString: function() {
            var n = that;
            var result = "";
            var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            while (!n.isZero()) {
                var div = n.divSmall(10);
                result = digits[div.rem] + result;
                n = div.quot;
            }
            return result;
        }
    };
    that.prototype = Object;
    that.prototype.toString = that.toString;
    return that;
}
