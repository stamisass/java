package il.ac.shenkar.xml;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Vector;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class XMLParser implements Runnable {
	private Data data;
	private String name;
	private String unit;
	private String currencyCode;
	private String country;
	private String rate;
	private String change;
	private List<Currency> currencies;
	private XMLCreator XmlFile;

	public XMLParser(Data data) {
		this.data = data;
		XmlFile = null;
		currencies = new Vector<Currency>();
	}

	@Override
	public void run() {
		InputStream is = null;
		HttpURLConnection con = null;
		URL url = null;

		try {

			url = new URL("http://www.boi.org.il/currency.xml");
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.connect();
			is = con.getInputStream();
			System.out.println("connection succeeded");
			Main.logger.info("connection succeeded");
			
			parse(is);
			Main.logger.info("Date :" + data.getDate());
		} catch (IOException e) {

			try {
				System.out.println("exception caught");
				Main.logger.info("exception caught");
				System.out.println("loading table from file");
				Main.logger.info("loading table from file");
				url = new File("C:\\LastUpdate.xml").toURI().toURL();
				is = url.openStream();

				parse(is);
			} catch (IOException e1) {

				e1.printStackTrace();
				Main.logger.error(e1.getMessage());
			}

		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
					Main.logger.error(e.getMessage());
				}
			}
			if (con != null) {
				con.disconnect();
			}
		}
	}

	private void parse(InputStream is) {

		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder;
		try {
			builder = factory.newDocumentBuilder();

			Document doc = builder.parse(is);

			NodeList dateList = doc.getElementsByTagName("LAST_UPDATE");
			NodeList nameList = doc.getElementsByTagName("NAME");
			NodeList unitList = doc.getElementsByTagName("UNIT");
			NodeList ccList = doc.getElementsByTagName("CURRENCYCODE");
			NodeList countryList = doc.getElementsByTagName("COUNTRY");
			NodeList rateList = doc.getElementsByTagName("RATE");
			NodeList changeList = doc.getElementsByTagName("CHANGE");

			data.setDate(dateList.item(0).getFirstChild().getNodeValue());
			XmlFile = new XMLCreator(data.getDate());

			int length = nameList.getLength();
			for (int i = 0; i < length; i++) {
				name = nameList.item(i).getFirstChild().getNodeValue();
				unit = unitList.item(i).getFirstChild().getNodeValue();
				currencyCode = ccList.item(i).getFirstChild().getNodeValue();
				country = countryList.item(i).getFirstChild().getNodeValue();
				rate = rateList.item(i).getFirstChild().getNodeValue();
				change = changeList.item(i).getFirstChild().getNodeValue();
				currencies.add(new Currency(name, unit, currencyCode, country,
						rate, change));
				XmlFile.writeXML(name, unit, currencyCode, country, rate,
						change);
			}

			data.setCurrencies(currencies);
		} catch (ParserConfigurationException | SAXException | IOException
				| DOMException | SetterFailureException e) {
			e.printStackTrace();
			Main.logger.error(e.getMessage());
		}
	}

}