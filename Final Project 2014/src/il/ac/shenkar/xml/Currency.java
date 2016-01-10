package il.ac.shenkar.xml;

public class Currency {
	private String name;
	private String unit;
	private String currenyCode;
	private String country;
	private String rate;
	private String change;

	public Currency(String name, String unit, String currenyCode,
			String country, String rate, String change)
			throws SetterFailureException {
		setName(name);
		setUnit(unit);
		setCurrenyCode(currenyCode);
		setCountry(country);
		setRate(rate);
		setChange(change);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) throws SetterFailureException {
		if (name.length() == 0)
			throw new SetterFailureException("Currency::name error");
		this.name = name;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) throws SetterFailureException {
		if (Double.parseDouble(unit) < 0)
			throw new SetterFailureException("Currency::unit error");
		this.unit = unit;
	}

	public String getCurrenyCode() {
		return currenyCode;
	}

	public void setCurrenyCode(String currenyCode)
			throws SetterFailureException {
		if (currenyCode.length() == 0)
			throw new SetterFailureException("Currency::currenyCode error");
		this.currenyCode = currenyCode;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) throws SetterFailureException {
		if (country.length() == 0)
			throw new SetterFailureException("Currency::country error");
		this.country = country;
	}

	public String getRate() {
		return rate;
	}

	public void setRate(String rate) throws SetterFailureException {
		if (Double.parseDouble(rate) < 0)
			throw new SetterFailureException("Currency::rate error");
		this.rate = rate;
	}

	public String getChange() {
		return change;
	}

	public void setChange(String change) {
		this.change = change;
	}

	@Override
	public String toString() {
		return "\nCurrency name=" + name + "\nunit=" + unit + "\ncurrenyCode="
				+ currenyCode + "\ncountry=" + country + "\nrate=" + rate
				+ "\nchange=" + change + "\n";
	}

}
