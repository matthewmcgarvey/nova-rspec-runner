RSpec.describe "foo" do
  it "works" do
    expect(1).to eq 1
  end
  
  it "fails" do
    expect(true).to eq(true)
    expect(1).to eq 2
  end
end