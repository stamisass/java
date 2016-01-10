package il.ac.shenkar.xml;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class XMLCreator {

	private DocumentBuilderFactory docFactory;
	private DocumentBuilder docBuilder;
	private static Document doc;
	static Element rootElement;

	public XMLCreator(String date) {
		try {
			docFactory = DocumentBuilderFactory.newInstance();
			docBuilder = docFactory.newDocumentBuilder();
			doc = docBuilder.newDocument();

			rootElement = doc.createElement("CURRENCIES");
			doc.appendChild(rootElement);

			Element dateElement = doc.createElement("LAST_UPDATE");
			dateElement.appendChild(doc.createTextNode(date));
			rootElement.appendChild(dateElement);

		} catch (ParserConfigurationException e) {

			e.printStackTrace();
			Main.logger.error(e.getMessage());
		}
	}

	public void writeXML(String name, String unit, String currencyCode,
			String country, String rate, String change) {
		try {
			Element currency = doc.createElement("CURRENCY");
			rootElement.appendChild(currency);

			Element nameElement = doc.createElement("NAME");
			nameElement.appendChild(doc.createTextNode(name));
			currency.appendChild(nameElement);

			Element unitElement = doc.createElement("UNIT");
			unitElement.appendChild(doc.createTextNode(unit));
			currency.appendChild(unitElement);

			Element currencyCodeElement = doc.createElement("CURRENCYCODE");
			currencyCodeElement.appendChild(doc.createTextNode(currencyCode));
			currency.appendChild(currencyCodeElement);

			Element countryElement = doc.createElement("COUNTRY");
			countryElement.appendChild(doc.createTextNode(country));
			currency.appendChild(countryElement);

			Element rateElement = doc.createElement("RATE");
			rateElement.appendChild(doc.createTextNode(rate));
			currency.appendChild(rateElement);

			Element changeElement = doc.createElement("CHANGE");
			changeElement.appendChild(doc.createTextNode(change));
			currency.appendChild(changeElement);

			TransformerFactory transformerFactory = TransformerFactory
					.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(doc);
			StreamResult result = new StreamResult(new File(
					"C:\\LastUpdate.xml"));

			transformer.transform(source, result);

		} catch (Exception e) {
			e.printStackTrace();
			Main.logger.error(e.getMessage());
		}

	}
}
