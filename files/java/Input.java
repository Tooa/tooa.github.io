import java.util.Scanner;

/*
 * Improved
 * - Exceptions now caught local
 * - Added readFloat();
 * - cleaned code
 * - changed names
 * 
 */

public class Input {
		public static String readString(){
			String input = "";
			try{
				input = (new Scanner(System.in)).nextLine();
			}catch(Exception e){
				System.err.println("Error while reading Line");
			}
			return input;
		}
		
		public static int readInt() {
			int input = 0;
			try{
				input = (new Scanner(System.in)).nextInt();
			}catch(Exception e ){
				System.err.println("Error while reading Integer");
			}
			return input;
		}
		
		public static float readFloat() {
			float input = 0;
			try{
				input = (new Scanner(System.in)).nextFloat();
			}catch(Exception e ){
				System.err.println("Error, use \",\" for decimal point!");
			}
			return input;
		}
		
		public static char readChar() {
			char input = ' ';
			try{
				input = (new Scanner(System.in)).nextLine().charAt(0);
			}catch(Exception e){
				System.err.println("Error while reading Char");
			}
			return input;
		}
}