# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'signIn', type: :graphql do
  before(:each) do
    travel_to Time.zone.local(1994)
  end
  after(:each) do
    travel_back
  end

  let(:query) do
    <<-GRAPHQL
    mutation SignInMutation($input: SignInInput!) {
      signIn(input: $input) {
        user {
          email
          username
        }
        token
      }
    }
    GRAPHQL
  end
  let(:user) { create(:user) }
  let(:variables) do
    {
      input: {
        email: user.email,
        password: 'password'
      }
    }
  end

  context 'current_user is nil' do
    let(:result) do
      {
        'data' => {
          'signIn' => {
            'token' => 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjo3NTc0Njg4MDB9.UUPAW1sH_uv3mY58FfCf_R3kZl-erkG_PmLYDYhqePQ',
            'user' => {
              'email' => 'user1@example.com',
              'username' => 'user1'
            }
          }
        }
      }
    end

    it { is_expected.to eql result }
  end
end