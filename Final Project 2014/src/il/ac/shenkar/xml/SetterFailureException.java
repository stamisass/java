package il.ac.shenkar.xml;

public class SetterFailureException extends Exception {

	private static final long serialVersionUID = 5190305158926422393L;

	public SetterFailureException(String msg) {
		super(msg);
	}

	@Override
	public String toString() {
		return "SetterFailureException message=" + super.getMessage();
	}

}