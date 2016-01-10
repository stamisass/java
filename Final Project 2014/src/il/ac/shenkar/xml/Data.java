package il.ac.shenkar.xml;

import java.util.List;
import java.util.Vector;

public class Data {
	private String Date;
	private List<Currency> currencies;

	public Data() {
		currencies = new Vector<Currency>();
	}

	public String getDate() {
		return Date;
	}

	public void setDate(String date) throws SetterFailureException {
		if (date.length() == 0)
			throw new SetterFailureException("Data::date error");
		
		Date = date;
	}

	public List<Currency> getCurrencies() {
		return currencies;
	}

	public void setCurrencies(List<Currency> currencies) {
		this.currencies = currencies;
	}

	@Override
	public String toString() {
		return "Data:\nDate=" + Date + "\ncurrencies=" + currencies + "\n";
	}

}
