package ir.ac.kntu;

import java.util.*;

public class Multiplier {

    public static void main(String [] args){
        System.out.println(solve("123" , "45"));
    }

    public static String solve(String bigInt1, String bigInt2) {
        String output = "";
        if(bigInt1 == null || bigInt2 == null){
            return  null;
        }
        int lenInt1 = bigInt1.length();
        int lenInt2 = bigInt2.length();
        int cursor;
        StringBuilder out = new StringBuilder ("0");
        for(int i = lenInt2-1 ; i != -1 ; i-- ){
            for(int j = lenInt1-1 ; j != -1 ; j--){
                int a = bigInt2.charAt(i) - '0';
                int b = bigInt1.charAt(j) -'0';
                int result = a*b;

                cursor = lenInt2 - j - 1 + lenInt1 - i - 1;
                while(result != 0){
                    if(cursor == out.length()){
                        out.append("0");
                    }

                    result += out.charAt(cursor) - '0';
                    out.setCharAt(cursor , (char)(((result)%10)+'0') ); ;
                    result/=10;
                    cursor++;
                }

            }

        }
        output = (out.reverse()).toString();
        return output;
    }
}