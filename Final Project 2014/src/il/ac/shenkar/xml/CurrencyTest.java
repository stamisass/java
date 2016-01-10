package il.ac.shenkar.xml;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class CurrencyTest {

	

	@Test
	public void testCurrency() throws SetterFailureException {//Tests if the constructor returns an object (not null)
		assertNotNull(new Currency("a", "1", "USD", "USA", "54", "76"));
	
	}

	@Test
	public void testGetName() throws SetterFailureException {//Tests if the getter returns the right value
		Currency C = new Currency("a", "1", "USD", "USA", "54", "76");
		String expected = "a";
		String result = C.getName();
		assertEquals(expected, result);
	}


	@Test
	public void testSetName() throws SetterFailureException {//Test if the setter sets the right value 
		Currency C = new Currency("a", "1", "USD", "USA", "54", "76");
		C.setName("V");
		assertEquals("V", C.getName());
		
	}

}
